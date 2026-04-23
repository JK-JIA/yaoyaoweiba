/**
 * 删除可再生成的构建缓存，释放磁盘（典型：frontend/.next 数百 MB）。
 * 不删除 node_modules；全量清理请用 npm run clean:deps 或 scripts/prune-heavy-folders.ps1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const dirs = [
  path.join(root, "frontend", ".next"),
  path.join(root, "backend", "dist"),
  path.join(root, ".next"),
  path.join(root, ".npm-cache")
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("removed:", path.relative(root, dir) || dir);
  } catch (e) {
    console.error("failed:", dir, e.message);
    process.exitCode = 1;
  }
}

console.log("Done. Rebuild: cd frontend && npm run build");
