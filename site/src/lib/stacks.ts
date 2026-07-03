const LABELS: Record<string, string> = { nest: "NestJS", next: "Next.js", php: "PHP" };

export function stackLabel(stack: string): string {
  return LABELS[stack] ?? stack.charAt(0).toUpperCase() + stack.slice(1);
}
