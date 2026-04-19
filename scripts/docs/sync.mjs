import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  analyzeRepository,
  appendMonthlyArchive,
  formatLocalDate,
  getMonthKey,
  updateProgressContent,
  upsertMonthlyEntry,
  writeFileIfChanged,
} from "./lib.mjs";

const cwd = process.cwd();
const args = process.argv.slice(2);
const staged = args.includes("--staged");
const dateIndex = args.indexOf("--date");
const summaryIndex = args.indexOf("--summary");
const dateString = dateIndex !== -1 && args[dateIndex + 1] ? args[dateIndex + 1] : formatLocalDate();

const analysis = analyzeRepository(cwd, { staged });
if (analysis.level === "trivial") {
  console.log("skip docs sync for trivial change");
  process.exit(0);
}

const summary = summaryIndex !== -1 && args[summaryIndex + 1]
  ? args[summaryIndex + 1]
  : analysis.suggestedSummary;

const changelogPath = path.join(cwd, "CHANGELOG.md");
const changelogContent = fs.readFileSync(changelogPath, "utf8");
const monthKey = getMonthKey(dateString);
const changelogEntry = `${dateString} \`${analysis.level}\` ${summary}`;
const nextChangelogContent = upsertMonthlyEntry(changelogContent, monthKey, changelogEntry);
writeFileIfChanged(changelogPath, nextChangelogContent);

if (analysis.needsProgress) {
  const progressPath = path.join(cwd, "docs", "progress.md");
  const progressContent = fs.readFileSync(progressPath, "utf8");
  const progressUpdate = updateProgressContent(progressContent, summary, dateString);
  writeFileIfChanged(progressPath, progressUpdate.content);

  const groupedOverflow = new Map();
  for (const line of progressUpdate.overflow) {
    const month = line.slice(2, 9);
    const current = groupedOverflow.get(month) ?? [];
    current.push(line);
    groupedOverflow.set(month, current);
  }

  for (const [month, lines] of groupedOverflow.entries()) {
    const archivePath = path.join(cwd, "docs", "progress", "archive", `${month}.md`);
    const previous = fs.existsSync(archivePath) ? fs.readFileSync(archivePath, "utf8") : `# ${month}\n\n`;
    const body = previous.trimEnd();
    const mergedLines = lines.filter((line) => !body.includes(line));
    if (mergedLines.length === 0) {
      continue;
    }
    const nextContent = `${body}\n${body.endsWith("\n") ? "" : "\n"}${mergedLines.join("\n")}\n`;
    appendMonthlyArchive(archivePath, month, nextContent.replace(/^# [^\n]+\n\n/, ""));
  }
}

console.log(`synced docs for ${analysis.level} change`);
