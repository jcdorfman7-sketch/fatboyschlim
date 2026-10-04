# FatBoySchlim v1.8.3b — Meal renderer fix

I found a real frontend mismatch.

The existing stable renderer was only decorating `.recipeCard`.
But the current 300+ meal library uses `.v15LibraryCard`, the weekly planner uses `.weekMealCell`, prepared meals use `.readyMeal`, and full recipe pages use `.recipeHero`.

So even when `media_assets` had approved recipe images, most meal screens could not display them.

## Install
1. Add `v1.8.3b.js`
2. Add `v1.8.3b.css`
3. Replace `index.html`
4. Replace `sw.js`

Do NOT load `v1.8.2.js` alongside this. `v1.8.3b.js` replaces it.

## No SQL required for the frontend fix
You already ran v1.8.3 matching SQL.

If no meal photos appear after deploying this package, run:
`v1.8.3b_DIAGNOSTIC.sql`

That will tell us whether the remaining problem is data coverage rather than rendering.
