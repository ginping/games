import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

export function isValidCommitMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    return false;
  }
  return /^(feat|fix|refactor|docs|test|build|ci|chore|perf|revert)(\([a-z0-9][a-z0-9/-]*\))?!?: .+\S$/.test(
    trimmed,
  );
}

const filePath = process.argv[2];
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!filePath) {
    console.error("missing commit message file");
    process.exit(1);
  }

  const message = fs.readFileSync(filePath, "utf8").split("\n")[0] ?? "";
  if (!isValidCommitMessage(message)) {
    console.error(
      "提交信息必须符合 Conventional Commit：type(scope): subject。允许的 type：feat fix refactor docs test build ci chore perf revert。",
    );
    process.exit(1);
  }
}
