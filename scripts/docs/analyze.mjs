import process from "node:process";
import { analyzeRepository } from "./lib.mjs";

const cwd = process.cwd();
const staged = process.argv.includes("--staged");
const analysis = analyzeRepository(cwd, { staged });

console.log(
  JSON.stringify(
    {
      level: analysis.level,
      needsChangelog: analysis.needsChangelog,
      needsProgress: analysis.needsProgress,
      reasons: analysis.reasons,
      stats: analysis.stats,
      suggestedSummary: analysis.suggestedSummary,
      files: analysis.files,
    },
    null,
    2,
  ),
);
