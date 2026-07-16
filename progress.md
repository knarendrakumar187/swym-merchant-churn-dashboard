# Build Progress — Merchant Churn Risk Dashboard

> Track checklist against [spec.md](./spec.md). Update status as tasks complete.

**Legend:** `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Planning

| # | Task | Status |
|---|------|--------|
| 0.1 | Gather and clarify requirements | [x] |
| 0.2 | Finalize and approve v1 spec | [x] |
| 0.3 | Create `spec.md` | [x] |
| 0.4 | Create `progress.md` | [x] |

---

## Phase 1 — Project setup

| # | Task | Status |
|---|------|--------|
| 1.1 | Initialize repo structure (`index.html`, `css/`, `js/`) | [x] |
| 1.2 | Add `README.md` with local run + GitHub Pages deploy steps | [x] |
| 1.3 | Verify local serve works (e.g. Live Server or `npx serve`) | [x] |

---

## Phase 2 — Data & logic

| # | Task | Status |
|---|------|--------|
| 2.1 | Create mock merchant data (5–10 records, all risk tiers covered) | [x] |
| 2.2 | Implement risk scoring rules (High / Medium / Low) | [x] |
| 2.3 | Implement recommendation mapping (one action per merchant) | [x] |
| 2.4 | Handle edge cases (e.g. `ordersPrior30d === 0`) | [x] |
| 2.5 | Unit-test or manually verify scoring against sample merchants | [x] |

---

## Phase 3 — UI

| # | Task | Status |
|---|------|--------|
| 3.1 | Build page layout (title, filter, table) | [x] |
| 3.2 | Render merchant table with all required columns | [x] |
| 3.3 | Add color-coded risk badges | [x] |
| 3.4 | Implement risk level filter (All / High / Medium / Low) | [x] |
| 3.5 | Implement column sorting (name, plan, risk) | [x] |
| 3.6 | Basic responsive / readable styling | [x] |

---

## Phase 4 — Verification

| # | Task | Status |
|---|------|--------|
| 4.1 | Confirm each mock merchant gets expected risk tier | [ ] |
| 4.2 | Confirm recommendations match primary trigger | [ ] |
| 4.3 | Test filter shows correct subsets | [ ] |
| 4.4 | Test sort asc/desc on sortable columns | [ ] |
| 4.5 | Cross-browser smoke check (Chrome) | [ ] |

---

## Phase 5 — Deployment

| # | Task | Status |
|---|------|--------|
| 5.1 | Push to GitHub | [ ] |
| 5.2 | Enable GitHub Pages | [ ] |
| 5.3 | Confirm live URL loads dashboard correctly | [ ] |
| 5.4 | Record live URL in README | [ ] |

---

## Phase 6 — Submission (assessment)

| # | Task | Status |
|---|------|--------|
| 6.1 | Export full AI chat transcript | [ ] |
| 6.2 | Submit live build link via Google Form | [ ] |
| 6.3 | Submit transcript + v1 spec doc | [ ] |

---

## Workflow

Each phase follows this gate:

1. **Before starting** — Agent describes what will be done in that phase
2. **Build** — Agent implements only that phase's scope
3. **After completing** — Agent asks for your approval
4. **You test** — You verify locally before saying "proceed"
5. **Next phase** — Only starts after explicit approval

---

## Current status

**Phase:** 3 complete — awaiting your approval before Phase 4  
**Blockers:** None  
**Next step:** You test Phase 3 UI, then approve to start Phase 4 (Verification)

---

## Notes / changes log

| Date | Note |
|------|------|
| 2026-07-16 | Phase 3 complete. Full dashboard UI with filter, sort, and styling. |
| 2026-07-16 | Pushed Phases 0–2 to GitHub (`736247c` on `main`). |
| 2026-07-16 | Phase 2 complete. 9 mock merchants, risk + recommendation logic verified. |
| 2026-07-16 | Phase 1 complete. Scaffold created; local serve verified (HTTP 200). |
