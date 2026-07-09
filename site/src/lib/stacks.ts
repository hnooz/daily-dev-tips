const LABELS: Record<string, string> = { nest: "NestJS", next: "Next.js", php: "PHP" };

export function stackLabel(stack: string): string {
  return LABELS[stack] ?? stack.charAt(0).toUpperCase() + stack.slice(1);
}

const INTROS: Record<string, string> = {
  laravel:
    "Short, practical Laravel tips: Eloquent performance, queues, testing helpers, and framework features most codebases underuse. Each tip is a copy-pasteable snippet with the why behind it.",
  vue: "Atomic Vue 3 tips covering the Composition API, reactivity gotchas, SSR safety, and the newest 3.5 APIs — each one a snippet you can apply in minutes.",
  nest: "Focused NestJS tips on pipes, dependency injection, validation, and clean production setups — small snippets that fix real backend pain points.",
  next: "Next.js App Router tips: caching semantics, Server Components, Server Actions, and streaming — the sharp edges of 15+, one snippet at a time.",
  nuxt: "Nuxt tips on data fetching, SSR state safety, Nitro caching, and hybrid rendering — small patterns that prevent double-fetches and leaks.",
  react:
    "React 19 tips: the compiler, new hooks like useActionState and useOptimistic, and patterns that replace boilerplate — each as a minimal snippet.",
  php: "Modern PHP tips for 8.3/8.4: property hooks, asymmetric visibility, typed constants — language features that make code safer with less ceremony.",
  go: "Go tips from recent releases: better error handling, iterators, benchmarks, and stdlib features that replace third-party crutches.",
  rust: "Rust tips on async, traits, pattern matching, and API design — idioms that make code compile-time safe and future-proof.",
};

export function stackIntro(stack: string): string {
  return (
    INTROS[stack] ??
    `Short, practical ${stackLabel(stack)} tips — each a copy-pasteable snippet with the reasoning behind it, curated and credited to the developer who contributed it.`
  );
}
