---
title: Drop forwardRef in React 19 and accept ref as a normal prop
stack: react
tags:
  - react19
  - refs
  - components
  - api
language: tsx
file: app/components/Input.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://react.dev/blog/2024/12/05/react-19
publishedAt: 2026-07-03
id: react-0002
---

```tsx
function Input({
  ref,
  ...props
}: React.ComponentPropsWithRef<'input'>) {
  return <input ref={ref} {...props} />
}

// no forwardRef wrapper needed
<Input ref={inputRef} placeholder="Email" />
```

React 19 lets function components receive `ref` as a regular prop, so `forwardRef` is no longer required for the common case of exposing a DOM node. Fewer wrappers means cleaner component types and less indirection. `forwardRef` still works for backward compatibility, but new components should just declare `ref` in props. Use `React.ComponentPropsWithRef` to type the forwarded element's props correctly.
