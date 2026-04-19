import process from "node:process";
import { analyzeRepository, evaluateGuard } from "./lib.mjs";

const cwd = process.cwd();
const staged = process.argv.includes("--staged");
const analysis = analyzeRepository(cwd, { staged });
const changedPaths = analysis.files.map((file) => file.path);
const result = evaluateGuard(analysis, changedPaths);

if (result.warning) {
  console.warn(result.warning);
}

if (!result.ok) {
  console.error(result.message);
  process.exit(result.code);
}

console.log(`docs guard passed: ${analysis.level}`);
