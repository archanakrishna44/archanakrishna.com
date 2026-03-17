---
status: active
tags: []
type: note
created: '2026-03-10'
modified: '2026-03-10'
---

# Coding Guidelines (No-Build HTML Site)

These rules define how we structure and implement this site. Optimize for simplicity, consistency, and maintainability.

---

## Stack and Assumptions

**This is a no-build site.**  
We ship plain HTML, plain JavaScript (JS), and plain CSS (Cascading Style Sheets).

Allowed libraries:
- jQuery (DOM (Document Object Model) selection, traversal, event handling, small UI changes)
- Lodash (shared helpers + lodash.template for templating)
- Bootstrap CSS (layout grid + basic utilities)

No bundlers, no transpilers, no framework-specific patterns.

---

## Repository Structure

- **HTML pages**: normal `.html` files
- **Shared/repeating modules**: `site-modules.html`
- **CSS**: one or more `.css` files (prefer a single primary stylesheet unless it grows too large)
- **JS**: one or more `.js` files (prefer a single primary script unless it grows too large)

---

## HTML Layout Rules

1. Use the **Bootstrap responsive grid**.
2. Major page sections should be **full width** (use `.container` and 'col-12' sections with inner containers as needed).
3. Only use the **`lg` breakpoint** for responsiveness.
   - Mobile/tablet: default stacking behavior
   - Desktop: layout changes begin at `lg`
4. Prefer clear, semantic sectioning:
   - `<header>`, `<main>`, `<section>`, `<footer>` where appropriate
5. Avoid deeply nested markup. Keep HTML structure easy to scan.

---

## Repeating Modules and Templates

### Source of truth
All repeating modules live in:
- `site-modules.html`
Repeating modules are simple code-drops, they should not be able to accept params or content, use css for that

Examples:
- header
- footer
- nav

### Templating approach
1. Use **`lodash.template`** for module rendering.
2. Templates must be:
   - easy to locate in `site-modules.html`
   - named clearly (IDs or data attributes)
   - small and composable

### Rules
1. Do **not** copy/paste repeating markup across pages.
2. If markup appears in 2+ places, it becomes a module/template.
3. Keep templates “dumb”:
   - template receives data
   - template renders markup
   - logic happens outside the template (in JS)

---

## JavaScript Rules

### Library usage
- Use **jQuery** for:
  - selecting elements
  - navigating the DOM tree (parents/children/siblings)
  - attaching events
  - applying UI changes (classes, attributes, text, show/hide)
- Use **Lodash** for:
  - `_.template` (shared templates/modules)
  - small utility helpers (mapping, grouping, etc.) when it meaningfully simplifies code

### Patterns
1. Prefer a single top-level initialization flow:
   - “load modules”
   - “bind events”
   - “initialize page behaviors”
2. Use functions to keep responsibilities clear:
   - `loadModules()`
   - `renderHeader()`
   - `bindNavEvents()`
3. Avoid global state.
   - If shared state is required, use a single top-level `App` object.

### Comments (required)
- Comment **each major block** of JS.
- Each major comment must include:
  - **where it is used** (page / module / selector)
  - **what it does**
  - **inputs/outputs** if relevant

Example comment format:
```js
// MODULE LOADER
// Used on: all pages (runs on DOM ready; targets #nav-placeholder, #footer-placeholder).
// What it does: fetches site-modules.html, injects nav and footer templates, sets active nav from URL (pathname + hash), binds responsive nav toggle.
// Inputs: none (reads window.location). Outputs: populated nav/footer DOM.
```