# FatBoySchlim v1.2 — Adaptive Planning & Intelligence

## What changed
- All four macros (calories, protein, carbs, fat) are visible and used in weekly balancing / swaps.
- Week calendar shows all four daily macro totals and includes **Fix day** / **Fine tune** actions.
- Fix Day makes the smallest useful meal swap instead of regenerating the entire week. “Close enough” is considered success.
- Grocery estimates now use a seeded store/package catalog for Kaufland, EDEKA, Walmart, Fry's and Safeway.
- Store selection controls native currency automatically.
- Count-based and volume-based purchase units are supported (e.g. eggs by each/carton, olive oil by ml).
- Grocery rows distinguish recipe need, package amount, recommended packages, packages bought, purchased amount and expected leftovers.
- Personal purchase history overrides starter baseline prices automatically over time.
- Price History can show the starter baseline alongside personal history and confidence.
- Cache/deployment handling is upgraded to v1.2 asset versioning and a network-first navigation service worker.

## Install
1. Run `v1.2_migration.sql` in Supabase with RLS enabled.
2. Replace the five frontend files in GitHub: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`.
3. Hard refresh once after deployment if an old service worker is still active.

## Pricing note
Seed prices are normal-price planning baselines, not coupon or promotional guarantees. Actual user purchases are stored separately and take priority as the app learns the user's real prices.

## Recipe photos
The app continues to reject unapproved/mismatched recipe imagery. Exact-photo production remains separate from the pricing and planning engine; placeholders are intentionally shown when an approved exact/close photo is unavailable.
