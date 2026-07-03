import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";

// JSON_SCHEMA keeps dates (publishedAt) as strings instead of YAML Date objects.
const engines = {
  yaml: {
    parse: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
    stringify: (o) => yaml.dump(o, { schema: yaml.JSON_SCHEMA, lineWidth: -1 }),
  },
};

export function parseTip(raw) {
  return matter(raw, { engines });
}

export function stringifyTip(content, data) {
  return matter.stringify(content, data, { engines });
}

// Stacks = directories under tips/. Adding a stack = adding a directory.
const TIPS_DIR = path.resolve(import.meta.dirname, "../tips");
export const STACKS = fs
  .readdirSync(TIPS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const NAMES = { nest: "NestJS", next: "Next.js", php: "PHP" };
export function humanize(stack) {
  return NAMES[stack] ?? stack.charAt(0).toUpperCase() + stack.slice(1);
}

// Body = first fenced code block, then prose explanation.
export function parseBody(content) {
  const fence = content.match(/```[^\n]*\n([\s\S]*?)```/);
  if (!fence) {
    throw new Error("No code block found in tip body");
  }
  const code = fence[1].replace(/\n$/, "");
  const explanation = content.slice(fence.index + fence[0].length).trim();
  return { code, explanation };
}

// FNV-1a 32-bit. Deterministic, non-security seed. Mirrors extension hashString.
export function hashSeed(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32 PRNG + Fisher-Yates. Shared with extension lib/tip-service.ts.
export function stableShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    const j = Math.floor(r * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
