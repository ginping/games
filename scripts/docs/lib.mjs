import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DOC_PATH_PREFIXES = ["docs/", ".agents/skills/project-doc-maintainer/"];
const COMMENT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);
const HIGH_IMPACT_FILES = new Set([
  ".mise.toml",
  "package.json",
  "wrangler.jsonc",
  "open-next.config.ts",
  "next.config.ts",
  "tsconfig.json",
]);

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMonthKey(dateString = formatLocalDate()) {
  return dateString.slice(0, 7);
}

export function isManagedDocPath(filePath) {
  return (
    filePath === "CHANGELOG.md" ||
    filePath === "AGENTS.md" ||
    DOC_PATH_PREFIXES.some((prefix) => filePath.startsWith(prefix))
  );
}

export function isCommentOrWhitespaceLine(line, filePath) {
  const ext = path.extname(filePath);
  const trimmed = line.trim();
  if (!trimmed) {
    return true;
  }
  if (!COMMENT_EXTENSIONS.has(ext)) {
    return false;
  }
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/")
  );
}

export function summarizeFiles(files) {
  const names = files.map((file) => file.path);
  const hasDocSystemChange = names.some(
    (name) =>
      name.startsWith("scripts/docs/") ||
      name.startsWith(".githooks/") ||
      name.startsWith(".agents/skills/project-doc-maintainer/") ||
      name === ".mise.toml",
  );
  const hasDependencyChange = names.includes("package.json");
  const hasDeployChange = names.some(
    (name) =>
      name === "wrangler.jsonc" ||
      name === "open-next.config.ts" ||
      name === "next.config.ts",
  );
  const routeFiles = names.filter((name) => name.startsWith("app/"));
  const hasGameRouteChange = routeFiles.length > 0;
  const hasGameRegistryChange = names.includes("lib/games.ts");
  const hasFrontendChange =
    hasGameRouteChange || hasGameRegistryChange || names.some((name) => name === "app/page.tsx");

  return {
    names,
    hasDocSystemChange,
    hasDependencyChange,
    hasDeployChange,
    hasGameRouteChange,
    hasGameRegistryChange,
    hasFrontendChange,
  };
}

export function buildSuggestedSummary(analysis) {
  const { summary } = analysis;
  if (summary.hasDocSystemChange) {
    return "建立项目文档维护机制、git hooks 与项目私有 skill";
  }
  if (summary.hasGameRouteChange && summary.hasGameRegistryChange) {
    return "更新游戏入口注册表与独立游戏路由";
  }
  if (summary.hasDeployChange && summary.hasDependencyChange) {
    return "更新部署配置与项目依赖";
  }
  if (summary.hasDeployChange) {
    return "更新 Cloudflare / OpenNext 部署配置";
  }
  if (summary.hasGameRegistryChange) {
    return "更新游戏注册表";
  }
  if (summary.hasFrontendChange) {
    return "更新前端页面或游戏入口";
  }
  if (analysis.nonDocFiles.length === 1) {
    return `更新 ${analysis.nonDocFiles[0].path}`;
  }
  return "整理项目实现与文档";
}

export function classifyChangeSet({ files, patchLines = [] }) {
  const nonDocFiles = files.filter((file) => !isManagedDocPath(file.path));
  const nonDocLineCount = nonDocFiles.reduce((sum, file) => sum + file.added + file.deleted, 0);
  const changedFileCount = nonDocFiles.length;
  const highImpact = nonDocFiles.some(
    (file) =>
      HIGH_IMPACT_FILES.has(file.path) ||
      file.path.startsWith("scripts/docs/") ||
      file.path.startsWith("scripts/git/") ||
      file.path.startsWith(".githooks/"),
  );
  const summary = summarizeFiles(nonDocFiles);

  const contentOnlyComments =
    patchLines.length > 0 &&
    patchLines.every((entry) => isCommentOrWhitespaceLine(entry.line, entry.path));

  let level = "notable";
  const reasons = [];

  if (changedFileCount === 0) {
    level = "trivial";
    reasons.push("only-managed-docs-changed");
  } else if (!highImpact && nonDocLineCount <= 2) {
    level = "trivial";
    reasons.push("tiny-non-doc-change");
  } else if (!highImpact && contentOnlyComments) {
    level = "trivial";
    reasons.push("comment-or-whitespace-only");
  } else {
    if (summary.hasDocSystemChange) {
      reasons.push("doc-maintenance-system-changed");
    }
    if (summary.hasGameRouteChange) {
      reasons.push("game-route-changed");
    }
    if (summary.hasGameRegistryChange) {
      reasons.push("game-registry-changed");
    }
    if (summary.hasDeployChange) {
      reasons.push("deploy-config-changed");
    }
    if (summary.hasDependencyChange) {
      reasons.push("dependency-or-script-changed");
    }

    if (
      summary.hasDocSystemChange ||
      nonDocLineCount >= 120 ||
      changedFileCount >= 8 ||
      (summary.hasDeployChange && summary.hasFrontendChange)
    ) {
      level = "major";
      reasons.push("wide-or-structural-change");
    }
  }

  const suggestedSummary = buildSuggestedSummary({
    summary,
    nonDocFiles,
  });

  return {
    level,
    needsChangelog: level === "notable" || level === "major",
    needsProgress: level === "major",
    reasons,
    stats: {
      changedFileCount,
      nonDocLineCount,
      managedDocFileCount: files.length - changedFileCount,
    },
    summary,
    files,
    nonDocFiles,
    suggestedSummary,
  };
}

function runGit(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function safeRunGit(cwd, args) {
  try {
    return runGit(cwd, args);
  } catch {
    return "";
  }
}

function parseNumstat(output, map) {
  for (const line of output.split("\n")) {
    if (!line.trim()) {
      continue;
    }
    const [addedRaw, deletedRaw, ...pathParts] = line.split("\t");
    const filePath = pathParts.join("\t");
    const current = map.get(filePath) ?? { path: filePath, added: 0, deleted: 0, status: "M" };
    const added = addedRaw === "-" ? 0 : Number(addedRaw);
    const deleted = deletedRaw === "-" ? 0 : Number(deletedRaw);
    current.added += Number.isNaN(added) ? 0 : added;
    current.deleted += Number.isNaN(deleted) ? 0 : deleted;
    map.set(filePath, current);
  }
}

function parseNameStatus(output, map) {
  for (const line of output.split("\n")) {
    if (!line.trim()) {
      continue;
    }
    const [statusRaw, ...pathParts] = line.split("\t");
    const filePath = pathParts[pathParts.length - 1];
    const current = map.get(filePath) ?? { path: filePath, added: 0, deleted: 0, status: statusRaw };
    current.status = statusRaw;
    map.set(filePath, current);
  }
}

function collectPatchLines(output) {
  const entries = [];
  let currentPath = null;
  for (const line of output.split("\n")) {
    if (line.startsWith("+++ b/")) {
      currentPath = line.slice(6);
      continue;
    }
    if (line.startsWith("@@") || line.startsWith("--- ") || line.startsWith("diff --git")) {
      continue;
    }
    if (!currentPath) {
      continue;
    }
    if (line.startsWith("+") || line.startsWith("-")) {
      const content = line.slice(1);
      entries.push({ path: currentPath, line: content });
    }
  }
  return entries;
}

function collectUntrackedFiles(cwd, map) {
  const output = safeRunGit(cwd, ["ls-files", "--others", "--exclude-standard"]);
  for (const filePath of output.split("\n").filter(Boolean)) {
    const absolute = path.join(cwd, filePath);
    let lines = 1;
    if (fs.existsSync(absolute)) {
      const buffer = fs.readFileSync(absolute);
      const isBinary = buffer.includes(0);
      if (!isBinary) {
        const content = buffer.toString("utf8");
        lines = content ? content.split("\n").length : 0;
      }
    }
    map.set(filePath, {
      path: filePath,
      added: lines,
      deleted: 0,
      status: "??",
    });
  }
}

export function collectChanges(cwd, { staged = false } = {}) {
  const map = new Map();

  if (staged) {
    parseNumstat(safeRunGit(cwd, ["diff", "--cached", "--numstat", "--find-renames=90%"]), map);
    parseNameStatus(
      safeRunGit(cwd, ["diff", "--cached", "--name-status", "--find-renames=90%"]),
      map,
    );
    const patchLines = collectPatchLines(
      safeRunGit(cwd, ["diff", "--cached", "--unified=0", "--no-color"]),
    );
    return { files: [...map.values()], patchLines };
  }

  parseNumstat(safeRunGit(cwd, ["diff", "--numstat", "--find-renames=90%"]), map);
  parseNameStatus(safeRunGit(cwd, ["diff", "--name-status", "--find-renames=90%"]), map);
  collectUntrackedFiles(cwd, map);

  const patchLines = [
    ...collectPatchLines(safeRunGit(cwd, ["diff", "--unified=0", "--no-color"])),
  ];
  return { files: [...map.values()], patchLines };
}

export function analyzeRepository(cwd, options = {}) {
  const { files, patchLines } = collectChanges(cwd, options);
  return classifyChangeSet({ files, patchLines });
}

export function ensureSection(content, heading, bodyLines = []) {
  if (content.includes(`## ${heading}`)) {
    return content;
  }
  const suffix = bodyLines.length > 0 ? `${bodyLines.join("\n")}\n` : "";
  return `${content.trimEnd()}\n\n## ${heading}\n\n${suffix}`;
}

export function upsertMonthlyEntry(content, monthKey, entry) {
  const heading = `## ${monthKey}`;
  if (!content.includes(heading)) {
    return `${content.trimEnd()}\n\n${heading}\n\n- ${entry}\n`;
  }

  const parts = content.split(heading);
  const before = parts[0];
  const after = parts.slice(1).join(heading);
  const [sectionBody, ...rest] = after.split(/\n## /);

  if (sectionBody.includes(entry)) {
    return content;
  }

  const normalizedBody = sectionBody.trimEnd();
  const updatedBody = normalizedBody
    ? `${normalizedBody}\n- ${entry}\n`
    : `\n\n- ${entry}\n`;

  const restText = rest.length > 0 ? `\n## ${rest.join("\n## ")}` : "";
  return `${before}${heading}${updatedBody}${restText}`.replace(/\n{3,}/g, "\n\n");
}

export function archiveChangelogContent(content, currentMonth) {
  const sections = content.split(/^## /m);
  const header = sections.shift() ?? "# Changelog\n";
  const keep = [header.trimEnd()];
  const archived = [];

  for (const rawSection of sections) {
    const section = rawSection.trim();
    if (!section) {
      continue;
    }
    const firstNewline = section.indexOf("\n");
    const monthKey = firstNewline === -1 ? section : section.slice(0, firstNewline).trim();
    const sectionContent = firstNewline === -1 ? "" : section.slice(firstNewline + 1).trim();
    if (monthKey === currentMonth) {
      keep.push(`## ${monthKey}\n\n${sectionContent}`.trimEnd());
    } else {
      archived.push({ monthKey, content: sectionContent });
    }
  }

  return {
    mainContent: `${keep.join("\n\n").trimEnd()}\n`,
    archived,
  };
}

export function updateProgressContent(content, entry, dateString) {
  const lines = content.split("\n");
  const recentUpdate = `- 最近更新：${dateString} ${entry}`;
  const recentMilestone = `- ${dateString}：${entry}`;
  const updatedLines = [];
  let inCurrentSnapshot = false;
  let replacedRecentUpdate = false;
  let inRecentMilestones = false;
  const milestones = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inRecentMilestones) {
        inRecentMilestones = false;
      }
      inCurrentSnapshot = line === "## Current Snapshot";
      inRecentMilestones = line === "## Recent Milestones";
      updatedLines.push(line);
      continue;
    }

    if (inCurrentSnapshot && line.startsWith("- 最近更新：")) {
      updatedLines.push(recentUpdate);
      replacedRecentUpdate = true;
      continue;
    }

    if (inRecentMilestones && line.startsWith("- ")) {
      milestones.push(line);
      continue;
    }

    updatedLines.push(line);
  }

  if (!replacedRecentUpdate) {
    const index = updatedLines.findIndex((line) => line === "## Current Snapshot");
    if (index !== -1) {
      updatedLines.splice(index + 1, 0, "", recentUpdate);
    }
  }

  const dedupedMilestones = [recentMilestone, ...milestones.filter((line) => line !== recentMilestone)];
  const keptMilestones = dedupedMilestones.slice(0, 8);
  const overflow = dedupedMilestones.slice(8);

  const marker = "## Recent Milestones";
  const markerIndex = updatedLines.findIndex((line) => line === marker);
  if (markerIndex !== -1) {
    let endIndex = markerIndex + 1;
    while (endIndex < updatedLines.length && !updatedLines[endIndex].startsWith("## ")) {
      endIndex += 1;
    }
    updatedLines.splice(markerIndex + 1, endIndex - markerIndex - 1, "", ...keptMilestones, "");
  }

  return {
    content: `${updatedLines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`,
    overflow,
  };
}

export function evaluateGuard(analysis, changedPaths) {
  const hasChangelog = changedPaths.includes("CHANGELOG.md");
  const hasProgress =
    changedPaths.includes("docs/progress.md") ||
    changedPaths.some((item) => item.startsWith("docs/progress/archive/"));

  if (analysis.level === "major" && (!hasChangelog || !hasProgress)) {
    return {
      ok: false,
      code: 1,
      message:
        "检测到 major 级别改动，但 staged 文件中没有同时更新 CHANGELOG.md 和 docs/progress.md。请先运行 /project-doc-maintainer commit。",
    };
  }

  if (analysis.level === "notable" && !hasChangelog) {
    return {
      ok: true,
      code: 0,
      warning:
        "检测到 notable 级别改动，但 staged 文件中还没有 CHANGELOG.md。建议先运行 /project-doc-maintainer commit。",
    };
  }

  return { ok: true, code: 0 };
}

export function writeFileIfChanged(filePath, content) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (current === content) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return true;
}

export function appendMonthlyArchive(filePath, monthKey, sectionContent) {
  const header = `# ${monthKey}\n\n`;
  const body = sectionContent.trim();
  const nextContent = `${header}${body}\n`;
  return writeFileIfChanged(filePath, nextContent);
}
