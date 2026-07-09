export const SITE_URL = "https://dailydevtips.mohammededris23.workers.dev/";
export const SITE_NAME = "Daily Dev Tip";
export const SITE_DESCRIPTION =
  "One atomic developer tip per new tab. Community-curated, contributor-credited.";

export function tipUrl(stack: string, slug: string): string {
  return new URL(`/${stack}/${slug}`, SITE_URL).toString();
}

export function ogUrl(stack: string): string {
  return new URL(`/og/${stack}.png`, SITE_URL).toString();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/[*_~#>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
