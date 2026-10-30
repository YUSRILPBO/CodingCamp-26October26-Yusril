# Implementation Plan: Expense & Budget Visualizer

## Overview

The existing implementation files (index.html, css/style.css, js/script.js) already implement all 11 requirements. The tasks below focus on auditing the existing code against the requirements and design, fixing the one identified gap (Chart.js CDN failure edge case), and optionally setting up a testing framework with unit and integration tests. No rewrite from scratch is needed.

The design document uses concrete JavaScript/TypeScript (not pseudocode), so the implementation language is JavaScript. The design explicitly omits a Correctness Properties section and states property-based testing is not applicable, so all test tasks use example-based unit tests and integration tests only.

## Tasks

- [x] 1. Audit and fix existing JavaScript implementation
  - [x] 1.1 Fix Chart.js CDN failure edge case in renderChart
    - In `renderChart()`, the canvas visibility is set before the `typeof Chart === "undefined"` guard. When Chart.js fails to load but transactions exist, the canvas is shown empty instead of being hidden.
    - Fix: check `typeof Chart !== "undefined"` before setting canvas/empty-state visibility so the canvas is hidden and the empty-state message governs visibility even when data exists but Chart.js is unavailable.
    - _Requirements: 4.3, 4.5_

  - [x] 1.2 Audit remaining JavaScript logic against functional requirements
    - Verify transaction form validation: all-fields check, amount > 0 check, inline error messages (Req 1.1-1.4)
    - Verify transaction list: scrollable list, empty-state message, delete by id, textContent-only rendering for injection safety (Req 2.1-2.4)
    - Verify total balance: sum of all amounts, auto-update on add/delete, IDR formatting with id-ID locale and zero fraction digits (Req 3.1-3.3)
    - Verify custom categories: input field and button, default seed [Food, Transport, Fun], non-empty and case-insensitive duplicate validation, dropdown update (Req 5.1-5.5)
    - Verify transaction sorting: sort control with four modes, display-only reordering via getSortedTransactions copy, default newest-first by id descending (Req 6.1-6.3)
    - Verify theme toggle: toggle button, light/dark switch, chart legend color refresh on toggle, persistence to Local Storage, default light (Req 7.1-7.5)
    - Verify data persistence: JSON-encoded storage with ebv_ prefix keys, restore on load, try/catch fallbacks in load and save (Req 8.1-8.5)
    - Fix any discrepancies found during the audit
    - _Requirements: 1.1-1.4, 2.1-2.4, 3.1-3.3, 5.1-5.5, 6.1-6.3, 7.1-7.5, 8.1-8.5_

- [x] 2. Audit HTML and CSS against architecture and design requirements
  - [x] 2.1 Verify HTML structure and architecture constraints
    - Confirm index.html at project root, exactly one CSS file in css/, exactly one JS file in js/ (Req 9.2)
    - Confirm no frontend framework, only Chart.js CDN script tag (Req 9.1, 9.3)
    - Confirm form fields (Item Name, Amount, Category), theme toggle button, sort dropdown, chart canvas, and transaction list elements all present (Req 1.1, 7.1, 6.1, 4.1)
    - Fix any missing or incorrect HTML elements
    - _Requirements: 9.1-9.4_

  - [x] 2.2 Verify CSS responsive design and visual identity
    - Confirm purple-blue gradient background #667eea to #764ba2 (Req 10.1)
    - Confirm white rounded cards with soft shadows via --card-bg, border-radius, --shadow (Req 10.2)
    - Confirm two-column grid above 700px and single-column stack at 700px or narrower (Req 10.3, 10.4)
    - Confirm #667eea as --primary for accents, balance, and buttons (Req 10.5)
    - Confirm CSS variable theme system with :root and [data-theme="dark"] blocks (Req 7.2, 7.3)
    - Confirm clean visual hierarchy and readable typography (Req 10.6)
    - Fix any missing or incorrect styles
    - _Requirements: 10.1-10.6, 7.2-7.3_

- [x] 3. Checkpoint - Ensure all fixes match requirements and design
  - Ensure all fixes pass, ask the user if questions arise.

- [ ] 4. Set up testing framework
  - [x]* 4.1 Install and configure Vitest with jsdom environment
    - Add package.json with Vitest and jsdom as dev dependencies
    - Create vitest.config.js with jsdom environment and any necessary transforms
    - _Requirements: 11.2 (tests are separate from app operation; app still runs without build steps)_

  - [ ]* 4.2 Refactor script.js for testability
    - Add ES module `export` statements to pure functions (formatMoney, getSortedTransactions, load, save, addTransaction, addCategory, deleteTransaction, renderList, renderBalance, renderChart, applyTheme, toggleTheme)
    - Wrap init code (event listeners and initial render) in an `init()` function with a guard so it only runs when the DOM is present, preventing errors during test imports
    - Update index.html script tag to `type="module"` so exports work in the browser
    - Verify the app still works in the browser after refactoring
    - _Requirements: 9.1, 9.2, 11.1_

- [ ] 5. Write unit tests
  - [ ]* 5.1 Write unit tests for formatMoney
    - Test formatMoney(25000) returns a string containing "Rp"
    - Test formatMoney(0) returns a valid zero-currency string
    - Test formatMoney with large numbers formats correctly with id-ID locale
    - _Requirements: 3.3_

  - [ ]* 5.2 Write unit tests for getSortedTransactions
    - Test newest mode returns items in descending id order
    - Test amount-desc returns items in descending amount order
    - Test amount-asc returns items in ascending amount order
    - Test category returns items in alphabetical category order
    - Test sorting preserves list length (no items dropped or duplicated)
    - Test sorting does not mutate the source transactions array
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 5.3 Write unit tests for validation logic
    - Test addTransaction with empty name shows "fill in all fields" error and does not mutate transactions
    - Test addTransaction with amount 0 or negative shows "greater than 0" error and does not mutate transactions
    - Test addCategory with empty name shows error and does not mutate categories
    - Test addCategory with case-insensitive duplicate shows error and does not mutate categories
    - _Requirements: 1.3, 1.4, 5.4, 5.5_

  - [ ]* 5.4 Write unit tests for storage helpers
    - Test load returns fallback when key is missing
    - Test load returns fallback when JSON is invalid
    - Test save then load round-trips a value correctly with mocked localStorage
    - Test save does not throw when underlying store rejects writes (mock throwing setter)
    - _Requirements: 8.3, 8.4, 8.5_

- [ ] 6. Write integration tests
  - [ ]* 6.1 Write integration test for add transaction flow
    - Submit a valid form and verify transaction is appended, persisted to mocked localStorage, balance updates, and list grows by one
    - _Requirements: 1.2, 3.2, 4.4_

  - [ ]* 6.2 Write integration test for delete transaction flow
    - Click delete on a transaction and verify it is removed, persisted, balance updates, and list shrinks by one
    - _Requirements: 2.3, 3.2, 4.4_

  - [ ]* 6.3 Write integration test for custom category add
    - Add a custom category and verify it persists, the select dropdown repopulates, and the new category is selected
    - _Requirements: 5.1, 5.3_

  - [ ]* 6.4 Write integration test for theme toggle persistence
    - Toggle theme and verify data-theme attribute changes on document element, choice persists to localStorage, and toggling twice returns to original theme
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]* 6.5 Write integration test for chart rendering
    - With a mocked Chart constructor, add transactions and verify chart is destroyed and recreated with aggregated labels and data
    - Verify with no transactions the canvas is hidden and empty-state message is shown
    - Verify with Chart.js unavailable the canvas is hidden even when data exists
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

  - [ ]* 6.6 Write integration test for sort persistence
    - Change sort dropdown and verify selection persists; on re-init the saved sort is restored
    - _Requirements: 6.1, 6.2_

  - [ ]* 6.7 Write integration test for HTML injection safety
    - Add a transaction with a name containing script tags and verify it is rendered as literal text (textContent equals input, no script execution)
    - _Requirements: 2.4_

- [ ] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- The existing implementation already covers all 11 requirements. Task 1.1 is the only confirmed code fix needed (Chart.js CDN failure edge case). All other audit tasks are verification-and-fix-if-needed.
- Tasks marked with `*` are optional and can be skipped for faster delivery. The application is fully functional without the testing framework.
- The design document explicitly states property-based testing is not applicable, so no property test tasks are included. All tests are example-based unit tests or integration tests.
- Test infrastructure (Vitest, jsdom) is separate from the application and does not affect the no-build-step requirement (Req 11.2). The app runs by opening index.html directly.
- Refactoring script.js to use ES module exports (task 4.2) is required for unit testing pure functions. ES modules are vanilla JavaScript and do not violate the no-framework constraint (Req 9.1).
- Each task references specific requirements for traceability between implementation and spec.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"] }
  ]
}
```
