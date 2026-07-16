# Merchant Churn Risk Dashboard — v1 Spec

> **Status:** Approved  
> **Context:** CX AI-Proficiency Build Round  
> **Last updated:** 2026-07-16

---

## 1. Problem statement

Build a simple dashboard that flags e-commerce SaaS merchants at risk of churning and recommends a next step for each one.

---

## 2. Scope (v1)

| In scope | Out of scope (v1) |
|----------|-------------------|
| Mock merchant data (5–10 records) | Real API / backend |
| Rule-based risk tiers (High / Medium / Low) | ML-based prediction |
| Sortable table + risk filter | Search, detail panel, summary cards |
| One recommendation per merchant | Multi-step playbooks / CRM integration |
| Static deploy to GitHub Pages | User auth, data persistence / editing |

---

## 3. Business context

**E-commerce SaaS platform** — merchants use a store-builder product on a subscription plan. Churn means cancellation, downgrade, or stopping sales, often preceded by measurable disengagement.

---

## 4. Tech stack & deployment

| Item | Choice |
|------|--------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Data | Static mock data file in repo (`merchants.js` or `data.json`) |
| Hosting | GitHub Pages |
| Persistence | None — read-only mock data |

---

## 5. Merchant record shape

Each merchant record contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique merchant identifier |
| `name` | string | Merchant / store name |
| `plan` | enum | `Starter` \| `Pro` \| `Enterprise` |
| `subscriptionStatus` | enum | `active` \| `trial` \| `past_due` \| `cancelled` |
| `ordersLast30d` | number | Order count in last 30 days |
| `ordersPrior30d` | number | Order count in prior 30-day window |
| `daysSinceLastLogin` | number | Days since merchant last logged in |
| `daysSinceLastOrder` | number | Days since last customer order |
| `activeProducts` | number | Currently listed products |
| `onboardingComplete` | number | Onboarding completion percentage (0–100) |
| `supportTickets30d` | number | Support tickets opened in last 30 days |

---

## 6. Churn signals (primary drivers)

These signals feed the risk model:

1. **Order volume trend** — `ordersLast30d` vs `ordersPrior30d`
2. **Login recency** — `daysSinceLastLogin`
3. **Order recency** — `daysSinceLastOrder`
4. **Subscription health** — `subscriptionStatus`
5. **Onboarding completion** — `onboardingComplete`
6. **Support friction** — `supportTickets30d`

---

## 7. Risk scoring (rule-based)

Risk is assigned as **High**, **Medium**, or **Low** using transparent rules. Evaluate in priority order; highest matched tier wins.

### High risk

Any of:

- `subscriptionStatus` is `past_due` or `cancelled`
- Order volume decline > 40%: `(ordersPrior30d - ordersLast30d) / ordersPrior30d > 0.40` (when `ordersPrior30d > 0`)
- `daysSinceLastLogin` ≥ 21
- `daysSinceLastOrder` ≥ 30

### Medium risk

Any of (if not already High):

- Order volume decline 15–40% (same formula as above)
- `subscriptionStatus` is `trial` AND (`daysSinceLastLogin` ≥ 7 OR `onboardingComplete` < 50)
- `onboardingComplete` < 50
- `supportTickets30d` ≥ 3

### Low risk

- All other merchants with none of the above triggers

### Edge cases

- If `ordersPrior30d` is 0, skip percentage decline rule; use absolute order counts and other signals instead.
- New merchants with very low history rely more on login, onboarding, and subscription status.

---

## 8. Recommendations (one per merchant)

Map the **primary trigger** to a single recommended next step. Priority order when multiple triggers apply:

| Primary trigger | Recommended next step |
|-----------------|----------------------|
| `past_due` / `cancelled` | Contact billing — resolve payment or win-back offer |
| `daysSinceLastOrder` ≥ 30 | Re-engagement outreach — check if store is still active |
| Order volume decline > 15% | Review catalog and pricing — offer growth consultation |
| `daysSinceLastLogin` ≥ 14 | Send re-engagement email and schedule success call |
| `supportTickets30d` ≥ 3 | Escalate to support lead — proactive outreach |
| `trial` + low onboarding | Send trial extension and onboarding checklist |
| `onboardingComplete` < 50 | Assign onboarding specialist for setup help |
| No triggers (Low risk) | No action — continue monitoring |

---

## 9. UI requirements

### Layout

- Page title and brief description
- Risk level filter: **All / High / Medium / Low**
- Merchant table

### Table columns

| Column | Sortable | Notes |
|--------|----------|-------|
| Merchant name | Yes | |
| Plan | Yes | |
| Risk level | Yes | Color-coded badge: High (red), Medium (amber), Low (green) |
| Key signal | No | Short text summary of top trigger |
| Recommendation | No | Single action string |

### Interactions

- **Filter:** Dropdown or button group to show merchants by risk tier
- **Sort:** Click column headers to sort (asc/desc toggle)
- **Responsive:** Readable on desktop; basic mobile stacking acceptable

### Visual design

- Clean, professional dashboard aesthetic
- Clear visual hierarchy for risk badges
- No branding assets required for v1

---

## 10. Mock data

- **Count:** 5–10 merchants
- **Coverage:** Include at least one merchant per risk tier (High, Medium, Low)
- **Variety:** Mix of plans, subscription statuses, and signal combinations so rules are demonstrable

---

## 11. File structure (planned)

```
sywm/
├── index.html          # Dashboard page
├── css/
│   └── styles.css      # Layout and risk badge styling
├── js/
│   ├── data.js         # Mock merchant records
│   ├── risk.js         # Risk scoring + recommendation logic
│   └── app.js          # Render table, filter, sort
├── spec.md             # This document
├── progress.md         # Build checklist
└── README.md           # Setup and GitHub Pages deploy notes
```

---

## 12. Success criteria

- [ ] Dashboard loads and displays all mock merchants
- [ ] Each merchant shows correct risk tier per rules in §7
- [ ] Each merchant shows one recommendation per rules in §8
- [ ] Filter by risk level works
- [ ] Table sorting works on designated columns
- [ ] Deployed and accessible via GitHub Pages URL

---

## 13. Open items / future (post-v1)

- Search by merchant name
- Summary stat cards (e.g. count at High risk)
- Merchant detail panel with full signal breakdown
- Editable merchant data or localStorage persistence
