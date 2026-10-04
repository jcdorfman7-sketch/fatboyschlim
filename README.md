# FatBoySchlim v1.3 — Repair, Rebalance & Execute

v1.3 focuses on real-world plan repair rather than silently rebuilding a week.

## Highlights
- Budget guardrail targeting the weekly budget with a preferred +15% maximum.
- Selectable Budget Fix suggestions with estimated savings and projected macro impact.
- One **FIX PLAN** action applies selected suggestions together, rebuilds groceries, and shows before/after cart cost.
- Safe snack-removal suggestions only when the affected day remains within a practical macro band.
- Cheaper meal-swap suggestions preserve meal type and avoid materially worsening daily macro fit.
- Package input cleanup: purchased package count is always discrete/whole-number.
- Human-facing purchase math remains need → package → recommended packages → bought → leftover.
- Skipped Flex sessions can be rolled forward while preserving rotation order.
- v1.3 asset/cache version bump to reduce stale GitHub Pages updates.

## Install
No new database schema is required if v1.2 has already been migrated successfully.
Replace these five frontend files in GitHub:
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js

Hard refresh once after deployment if an old service worker is still active.
