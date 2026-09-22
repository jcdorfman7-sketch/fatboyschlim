# FatBoySchlim v0.8 — Smart Food Ecosystem

v0.8 connects planning, pantry, prepared meals, recipe feedback, and Eat.

## Install
1. Run `v0.8_migration.sql` in Supabase SQL Editor.
2. Replace `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, and `sw.js` in GitHub.
3. Hard-refresh once after GitHub Pages deploys.

## Major changes
- Exact/close recipe-photo policy. Old random v0.7 image URLs are removed and replaced with honest placeholders.
- Pantry quantities are subtracted from generated grocery needs.
- Cooking prepared servings consumes pantry ingredients and creates prepared-meal inventory.
- Eat shows prepared meals separately and decrements them as they are eaten.
- Weekly generation considers pantry overlap, recent recipe history, meal type, macros, meal-prep mode, and recipe feedback.
- Favorite / Make again / Don't suggest feedback.
- Recipe browser with search and meal-type filters.
- Finish My Day chooses the closest planned/prepared meal to remaining calories and protein.
- Food logs can now link back to recipe IDs for history-aware generation.

## Images
v0.8 deliberately does not show an unrelated stock photo. A recipe image is shown only when its database `image_status` is `exact` or `close`; otherwise the UI displays a clean placeholder. Exact recipe imagery can now be added recipe-by-recipe in Supabase without changing app code.
