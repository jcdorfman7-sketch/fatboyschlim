# FatBoySchlim v1.5 — Massive Food Library

## Main changes
- 300+ total meal/recipe target after migration, including flexible macro-builder meals.
- Expanded nutrition grocery catalog with common proteins, dairy, produce, carbs, fats, sauces and convenience foods.
- Budget strategy: Cheapest possible / Budget-conscious / Balanced / Variety-first.
- Low-budget plans heavily down-rank premium foods unless already in the pantry.
- Pantry-first and Cheap Week one-tap planning modes.
- Cooking-time constraint and max recipe repeats.
- Recipe browser filters for macro builders, budget meals, quick meals and high-protein meals.
- Grocery library browser in Pantry.
- Expanded starter package/price baselines for common new foods. User purchase history still takes precedence.

## Install
Run the four SQL files in order. Each is intentionally kept short enough to paste into Supabase separately:
1. `v1.5_part1_schema.sql`
2. `v1.5_part2_foods.sql`
3. `v1.5_part3_recipes.sql`
4. `v1.5_part4_prices.sql`

Then replace the five GitHub Pages frontend files: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`.

## Notes
The new store prices are planning baselines, not coupon/sale promises. Actual purchase history takes priority as you use the app. Recipe photos remain governed by the Exact/Close approval system; v1.5 does not reintroduce random mismatched photography.
