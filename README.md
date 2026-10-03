# FatBoySchlim v1.1 — Macro → Calendar → Cart

v1.1 focuses on the nutrition-to-shopping execution loop.

## New in v1.1
- Visual Week View calendar with Breakfast / Lunch / Snack / Dinner lanes.
- Repeated meal-prep portions are numbered (for example portion 1/3, 2/3, 3/3) and mapped to the days they are intended to be eaten.
- Daily planned macro totals appear directly in the week calendar.
- Meal-prep map shows where repeated portions are scheduled.
- Grocery pricing follows the selected store's native currency (Kaufland/EDEKA = EUR, Fry's/Safeway/Walmart = USD).
- Advanced per-item price history: latest price, recent average, lowest recorded, history count and confidence.
- Package-aware shopping remains explicit: recipe need, package size, recommended packages, packages purchased, purchased grams, actual total paid and expected leftovers.
- Weekly Coach now centers the actual meal calendar before lock-in.

## Install
1. In Supabase, open SQL Editor → New query.
2. Run `v1.1_migration.sql` with RLS.
3. Replace the five frontend files in GitHub: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`.
4. Hard-refresh once after GitHub Pages deploys.

The recipe photo manifest remains a production reference and is not required for deployment.
