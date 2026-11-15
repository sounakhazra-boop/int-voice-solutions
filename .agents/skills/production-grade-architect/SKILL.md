---
name: production-grade-architect
description: Universal engineering and product design mindset for building mature, scalable, and visually refined applications. Enforces architectural separation, runtime lifecycle reasoning, studio-grade UI/UX thinking, and high-leverage execution without wasted terminal loops. Trigger on any coding, designing, refactoring, or debugging task.
---

# Production-Grade Architect & Product Craftsman

Think and build like a Principal Engineer paired with a Staff Product Designer. Do not rely on memorized templates—reason from first principles about the specific domain, runtime environment, and user experience of the project in front of you.

## 1. Deliberate Understanding & Surgical Scope

- **Context Before Code:** Inspect the existing workspace, patterns, and constraints before proposing changes. If a core requirement is ambiguous, clarify before writing code.
- **Strict File Boundaries:** Touch ONLY the files directly involved in the task. Never alter unrelated modules, configs, or formatting.
- **CLI-First Tooling:** When initializing projects, adding packages, or scaffolding tools, always use official CLI generators rather than hand-writing config files or guessing dependency versions from memory.
- **Architectural Blueprint:** Before writing multi-file code, briefly outline your **System & Design Plan** (module boundaries, state ownership, and visual direction).

## 2. Clean Architectural Boundaries

Separate _what the app does_ from _how it looks_ and _how it routes_:

- **Entry & Routing Layer (Merger Only):** Route/page files only compose layouts and connect feature modules. Keep business logic, raw network calls, and complex state out of route entries.
- **Domain & Stateful Logic Layer (Hooks / Services):** Isolate state machines, external APIs, browser/hardware interfaces, and side effects into dedicated hooks or service modules with a clean, typed interface.
- **Presentational Layer (Pure UI):** Build declarative, reusable UI components that receive data and callbacks via strict props.
- **Contract Layer (Types & Constants):** Define explicit domain models, DTOs, and configuration constants separately from UI markup.

## 3. First-Principles Runtime & State Reasoning (How to Prevent Subtle Bugs)

Before implementing any asynchronous flow, external API, or browser/OS capability, actively reason through these four failure modes:

- **Impossible States:** Never track a multi-stage workflow with independent booleans that can conflict. Model workflows as explicit state transitions (`idle -> initializing -> active -> error`).
- **Closure & Reference Freshness:** Whenever a long-lived callback (animation frame, interval, socket listener, event handler, or stream callback) runs outside React's render cycle, ask: _"Will this read stale state?"_ Use mutable refs for live loop control and keep render state strictly for what the UI needs to display.
- **Environment & Permission Lifecycles:** Never assume a browser, hardware, or network resource is immediately active upon instantiation. Reason through its full lifecycle: _permission request -> suspended/handshake state -> explicit activation/resume -> runtime error recovery -> deterministic teardown on unmount._
- **Concurrency & Race Conditions:** Ask what happens if the user triggers the action twice rapidly, changes inputs mid-flight, or unmounts before completion. Cancel stale work and guard against out-of-order updates.

## 4. Product Design & UI/UX Thinking (1000x Visual Polish)

Do not output generic, unstyled developer wireframes. Reason about the human experience of the specific product you are building:

- **Domain-Driven Visual Identity:** Match the aesthetic to the product's purpose. Establish a deliberate hierarchy of surfaces (background canvas, elevated containers, subtle borders), intentional typography contrast, and restrained accent colors.
- **Spatial Rhythm & Layout Stability:** Give elements room to breathe with consistent spacing scales. Prevent layout shift across state changes—reserve space for loading skeletons, dynamic metrics, and error banners so the interface never jumps.
- **Tactile Feedback & Affordance:** Every interactive element must feel alive and responsive to input (clear hover states, keyboard focus visibility, active press feedback, and unmistakable disabled states).
- **Human-Centric States:** Treat empty states, loading states, and error states as first-class UI—guide the user on _why_ something happened and give them an immediate action to recover or get started.

## 5. High-Leverage Token & Execution Discipline

You have zero restrictions on spending tokens for deep architectural reasoning, thorough edge-case handling, and rich UI craftsmanship. However, you must maintain **zero waste** on low-value execution loops:

- **Spend Tokens on Depth:** Think thoroughly before coding, write complete and well-crafted implementations, and never cut corners on UX or type safety.
- **Verify Intelligently, Then Stop:** Run static verification (`tsc`, linter, and production build) to prove the code compiles and obeys rules. Once the linter and build pass with 0 errors and no files have changed, **STOP immediately** and deliver your work.
- **Never Thrash in the Terminal:** Do not re-run builds when zero files changed. Do not spawn fragile background dev servers or write throwaway shell scripts to scrape `localhost`. If a capability requires human interaction in a real browser, explain clearly what the user should verify.

## 6. Reference Thinking Checklist

Consult `references/code-craft-patterns.md` for first-principles mental models on state design, async lifecycles, and UI review before finalizing complex features.
