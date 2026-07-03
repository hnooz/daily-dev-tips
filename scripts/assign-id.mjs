import fs from "node:fs/promises";
import path from "node:path";
import { STACKS, parseTip, stringifyTip } from "./shared.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

async function main() {
  let assigned = 0;

  for (const stack of STACKS) {
    const dir = path.join(ROOT, "tips", stack);
    let files = [];
    try {
      files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md")).sort();
    } catch {
      continue;
    }

    const parsed = await Promise.all(
      files.map(async (f) => ({ f, ...parseTip(await fs.readFile(path.join(dir, f), "utf8")) }))
    );

    const existingIds = parsed
      .map((p) => p.data.id)
      .filter(Boolean)
      .map((id) => parseInt(id.split("-")[1], 10));
    let next = Math.max(0, ...existingIds) + 1;

    for (const p of parsed) {
      if (p.data.id) {
        continue;
      }
      p.data.id = `${stack}-${String(next).padStart(4, "0")}`;
      await fs.writeFile(path.join(dir, p.f), stringifyTip(p.content, p.data));
      console.log(`assigned ${p.data.id} → tips/${stack}/${p.f}`);
      next++;
      assigned++;
    }
  }

  console.log(`✓ assigned ${assigned} id(s)`);
}

main();
