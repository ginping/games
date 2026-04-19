import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  appendMonthlyArchive,
  archiveChangelogContent,
  formatLocalDate,
  getMonthKey,
  writeFileIfChanged,
} from "./lib.mjs";

const cwd = process.cwd();
const dateArgIndex = process.argv.indexOf("--date");
const dateString =
  dateArgIndex !== -1 && process.argv[dateArgIndex + 1]
    ? process.argv[dateArgIndex + 1]
    : formatLocalDate();
const currentMonth = getMonthKey(dateString);

const changelogPath = path.join(cwd, "CHANGELOG.md");
if (fs.existsSync(changelogPath)) {
  const content = fs.readFileSync(changelogPath, "utf8");
  const archived = archiveChangelogContent(content, currentMonth);
  writeFileIfChanged(changelogPath, archived.mainContent);
  for (const item of archived.archived) {
    const archivePath = path.join(cwd, "docs", "changelog", `${item.monthKey}.md`);
    appendMonthlyArchive(archivePath, item.monthKey, item.content);
  }
}

console.log(`archive complete for ${currentMonth}`);
