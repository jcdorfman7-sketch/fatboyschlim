# FatBoySchlim v0.8.1 — Shop, Pantry & Daily Planning

This release fixes the food workflow rather than adding a new section.

## What changed
- Shop now has clear **Plan / Grocery List / Pantry** views.
- Pantry is editable and visible. Pantry quantities are subtracted from the grocery list and strongly influence meal generation.
- Checking a grocery item as purchased adds the purchased quantity to pantry once.
- Store pricing is now explicitly editable with **Shelf price + Package size** fields. Estimates recalculate on screen and can be saved per food/store.
- Optional **Actually paid** totals can also be recorded.
- Weekly generation now creates actual **daily plans**, with selectable Breakfast / Lunch / Snack / Dinner slots and 1–7 days.
- The generator scores the whole day, not just isolated meals, while also considering pantry overlap, diet, feedback, history, and meal-prep preference.
- Added 10 simple first-class snack recipes and supporting foods.
- Eat now opens on the selected day's plan and shows planned daily macros against the user's target.
- Finish My Day prioritizes simple snack fits when there is a macro gap.

## Install
1. Run `v0.8.1_migration.sql` in Supabase SQL Editor.
2. Replace these five files in GitHub Pages:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `sw.js`
3. Reload the site. If an old cached build appears, hard refresh once.

## Pricing note
FatBoySchlim does not invent store prices. A food/store gets an estimate once a shelf price and package size have been saved. Future lists reuse the latest saved price for that store.
