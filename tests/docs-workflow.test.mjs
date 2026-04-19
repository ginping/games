import test from "node:test";
import assert from "node:assert/strict";
import {
  archiveChangelogContent,
  classifyChangeSet,
  evaluateGuard,
  updateProgressContent,
} from "../scripts/docs/lib.mjs";
import { isValidCommitMessage } from "../scripts/git/validate-commit-msg.mjs";

test("small non-doc changes are trivial", () => {
  const analysis = classifyChangeSet({
    files: [{ path: "app/page.tsx", added: 1, deleted: 1, status: "M" }],
    patchLines: [{ path: "app/page.tsx", line: "const title = title;" }],
  });

  assert.equal(analysis.level, "trivial");
});

test("new game route is notable", () => {
  const analysis = classifyChangeSet({
    files: [{ path: "app/snake/page.tsx", added: 32, deleted: 0, status: "A" }],
    patchLines: [{ path: "app/snake/page.tsx", line: "export default function Snake() {}" }],
  });

  assert.equal(analysis.level, "notable");
  assert.equal(analysis.needsChangelog, true);
});

test("doc maintenance workflow changes are major", () => {
  const analysis = classifyChangeSet({
    files: [
      { path: "scripts/docs/sync.mjs", added: 40, deleted: 0, status: "A" },
      { path: ".githooks/pre-commit", added: 8, deleted: 0, status: "A" },
      { path: ".agents/skills/project-doc-maintainer/SKILL.md", added: 50, deleted: 0, status: "M" },
    ],
    patchLines: [{ path: "scripts/docs/sync.mjs", line: "console.log('sync')" }],
  });

  assert.equal(analysis.level, "major");
  assert.equal(analysis.needsProgress, true);
});

test("guard blocks major changes without changelog and progress", () => {
  const analysis = classifyChangeSet({
    files: [{ path: "scripts/docs/lib.mjs", added: 60, deleted: 0, status: "A" }],
    patchLines: [{ path: "scripts/docs/lib.mjs", line: "export const x = 1;" }],
  });

  const result = evaluateGuard(analysis, ["scripts/docs/lib.mjs"]);
  assert.equal(result.ok, false);
});

test("guard allows trivial changes", () => {
  const analysis = classifyChangeSet({
    files: [{ path: "app/page.tsx", added: 1, deleted: 1, status: "M" }],
    patchLines: [{ path: "app/page.tsx", line: "return title;" }],
  });

  const result = evaluateGuard(analysis, ["app/page.tsx"]);
  assert.equal(result.ok, true);
});

test("commit message validator enforces conventional commit", () => {
  assert.equal(isValidCommitMessage("feat(home): add hero card"), true);
  assert.equal(isValidCommitMessage("update homepage"), false);
});

test("archive changelog keeps current month and extracts history", () => {
  const result = archiveChangelogContent(
    [
      "# Changelog",
      "",
      "## 2026-04",
      "",
      "- 2026-04-20 `major` setup docs workflow",
      "",
      "## 2026-03",
      "",
      "- 2026-03-29 `notable` previous work",
      "",
    ].join("\n"),
    "2026-04",
  );

  assert.match(result.mainContent, /## 2026-04/);
  assert.equal(result.archived.length, 1);
  assert.equal(result.archived[0].monthKey, "2026-03");
});

test("progress update keeps only latest eight milestones", () => {
  const content = [
    "# Progress",
    "",
    "## Current Snapshot",
    "",
    "- 阶段：进行中",
    "- 最近更新：2026-04-01 旧更新",
    "",
    "## Active Tracks",
    "",
    "- track",
    "",
    "## Recent Milestones",
    "",
    "- 2026-04-08：m8",
    "- 2026-04-07：m7",
    "- 2026-04-06：m6",
    "- 2026-04-05：m5",
    "- 2026-04-04：m4",
    "- 2026-04-03：m3",
    "- 2026-04-02：m2",
    "- 2026-04-01：m1",
    "",
    "## Next Focus",
    "",
    "- next",
    "",
  ].join("\n");

  const updated = updateProgressContent(content, "new milestone", "2026-04-09");
  assert.match(updated.content, /2026-04-09：new milestone/);
  assert.equal(updated.overflow.length, 1);
  assert.equal(updated.overflow[0], "- 2026-04-01：m1");
});
