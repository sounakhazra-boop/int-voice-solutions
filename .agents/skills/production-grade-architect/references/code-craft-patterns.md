# First-Principles Engineering & Design Mental Models

Use these mental models to reason through any feature before writing code.

## 1. The Stateful Lifecycle Audit

Whenever integrating an external resource (Network API, WebSocket, Hardware Device, Storage, Timer, or Worker), trace all 5 phases before coding:

1. **Initialization & Handshake:** Does the API require a user gesture, permission prompt, or explicit `.resume()` / `.connect()` call before data flows?
2. **Stale Closure Check:** Does an event listener or high-frequency loop (`requestAnimationFrame`, `setInterval`, socket `.on()`) reference component state?
   - _Rule:_ Keep high-frequency mutable pointers and active flags in `useRef`; only push throttled or meaningful state transitions to `useState` for rendering.
   - _Rule:_ In React components, always declare all Hooks unconditionally at the top of the component before any early-return guard clauses.
3. **In-Flight Cancellation:** If inputs change or the component unmounts mid-operation, how is the in-flight operation aborted?
4. **External Data Distrust:** Never trust external payloads. Normalize edge-case formats (empty strings, missing optional fields, protocol-relative URLs) at the service boundary before they reach UI components.
5. **Deterministic Teardown:** Ensure every allocated resource (connections, tracks, contexts, timers, listeners) is explicitly closed in the cleanup path.

---

## 2. The UI/UX Self-Critique Pass

Before considering a component finished, evaluate it through a designer's lens:

- **Visual Hierarchy Check:** Looking at the screen from 5 feet away, is the primary action and core content immediately obvious? Are secondary details visually quieter?
- **Motion & Stability Check:** When live data updates (timers, progress bars, counters, live feeds) or states transition (`loading -> ready`), does the layout stay rock-solid without horizontal jitter or vertical jumping?
- **Edge-State Empathy:** What does the screen look like on first launch (0 items), during slow networks, on narrow viewports, or when permissions/requests fail? Every state must look intentionally designed.
