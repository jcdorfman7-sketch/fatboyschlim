# FatBoySchlim v0.7 — Big-Ass Cookbook

Major food-system release built on v0.6.1.

## Install
1. Run all prior migrations through v0.6.1 if not already installed.
2. Run `v0.7_migration.sql` in Supabase SQL Editor.
3. Replace the five GitHub Pages frontend files: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`.

## v0.7
- 100 new structured recipes (115 total when the original 15 remain)
- Breakfast / Lunch / Dinner / Snack classifications
- meal-type-aware weekly generation
- clearer Replace Meal flow
- already-selected recipes excluded from swap choices
- realistic food-photo prototype surface
- multiple Cook Mode methods where appropriate: stovetop, air fryer, oven
- beginner-level step-by-step instructions and safe doneness temperatures
- practical ingredient quantities and serving scaling
- meal-prep storage/reheating guidance
- prepared-portions inventory table and Save Prepared Portions action
- existing v0.6.1 store-price learning and locked-week workflow retained

### Photography note
v0.7 uses dynamically sourced real food photography as prototype imagery. It is not guaranteed to depict the exact recipe. Exact standardized recipe photography should replace these URLs before a public production release.
