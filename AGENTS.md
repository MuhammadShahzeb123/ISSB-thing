# ISSB Prep – notes for agents

Next.js 16 (webpack) + React 19 + Tailwind 4, no test runner. Verify changes with:

```bash
npx tsc --noEmit -p tsconfig.json   # typecheck
npm run lint                        # eslint (React Compiler rules are ON: no ref reads/writes or setState during render, no sync setState in effects)
npm run build                       # next build; ~1 min, generates 135 static pages
npm run dev -- --port 3111          # dev server
```

## Motion system (app/lib/motion, app/components/motion, app/motion.css)

Zero-dependency spring motion. Everything animated is a closed-form damped spring evaluated at the current time
(`app/lib/motion/spring.ts`), driven by one shared requestAnimationFrame ticker; retargets re-seed from the live
position and velocity so interruptions never jump. Damping ratios stay in 0.72–1.0 (tiny overshoot at most).

- CSS side: `--ease-snappy / --ease-gentle / --ease-stiff` are `linear()` samples of the same springs
  (`springEasing()` in spring.ts); regenerate them if you change a preset. Use them for hover/press transitions
  and keyframe entrances (`.stagger`, `.page-enter`, `swap-in/out`).
- `useSpring(target, config)` returns a `Spring`; `useSpringOutput(springs, apply)` writes to the DOM once per
  frame without re-rendering; `useSpringNumber` re-renders for small leaf text. `useReducedMotion()` makes
  springs jump.
- Primitives: `Swap` (content swaps with a short blur while the container's height/width morphs; nest inner
  Swaps with `morph="none"` and let the outermost one morph), `Segmented` (liquid indicator, leading edge is
  stiff, trailing edge lags), `Toggle` (stretchy knob), `RollingNumber` (odometer digits), `MorphButton`
  (label → spinner → drawn check), `Toast`, `useLiquidInk` (any sliding highlight; mark targets with
  `data-ink`), `stagger(i)` for `.stagger` children.
- Keep toasts and other `position: fixed` elements outside a `Swap` (entering content is transformed briefly).
- Respect `prefers-reduced-motion`: CSS collapses durations; Swap creates no ghosts; springs jump.
