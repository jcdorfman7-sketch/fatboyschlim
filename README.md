# FatBoySchlim v0.9

## What changed

### Shop / Pantry
- Separates **needed quantity**, **package size**, **recommended packages**, **packages actually purchased**, **purchased grams**, and **actual total paid**.
- Purchased quantity — not recipe quantity — is what gets added to Pantry.
- Store/package prices are saved and reused for future estimates.
- Pantry now supports expiration dates and a **Use soon** flag.
- Meal generation gives extra preference to pantry ingredients and especially Use-soon ingredients.

### Meal planning
- Daily meal plans remain grouped by Breakfast / Lunch / Snack / Dinner.
- Generator balances meals across the whole day instead of treating each meal as an isolated macro target.
- Pantry, recent meals, favorites, diet rules, ingredient overlap, and meal-prep mode all influence selection.
- Snacks remain first-class meal slots.

### Flex
- Real workout planner and logger.
- Program families: Push/Pull/Legs, Upper/Lower, Full Body, and body-part split.
- Choose 1–7 training days/week; the workout rotation continues across weeks instead of resetting.
- PPL uses genuinely different A/B sessions and different main lifts.
- Supplied templates use 5×5 on selected compounds and higher rep ranges on hypertrophy/accessory work.
- Live set logging, previous best display, estimated PR detection, workout completion, progression suggestions, technique cues, and intelligent same-pattern exercise swaps.
- Exercise blacklist/exclusions are supported. The supplied templates do **not** use dips.

### Today / Progress
- Today now combines nutrition, today's planned meals, today's workout, and weight.
- Progress adds 7-day nutrition averages and 28-day training consistency alongside body measurements.

## Recipe photos
v0.9 keeps the strict v0.8 image rule: a recipe photo is displayed only when the recipe's `image_status` is `exact` or `close`. Placeholder imagery is used rather than knowingly showing the wrong food. The app is ready for an exact recipe-photo asset pass; generic/mismatched image sourcing was intentionally not restored.

## Upgrade from v0.8.1
1. In Supabase, open **SQL Editor → New query**.
2. Run `v0.9_migration.sql` **with RLS**.
3. Replace these five files in GitHub Pages:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `sw.js`
4. Hard-refresh the site or close/reopen the installed PWA so the v0.9 service-worker cache replaces the old one.

## First test
1. Shop → Pantry: add a few foods and mark one **Use soon**.
2. Shop → Plan: generate a 3-day plan with Breakfast/Lunch/Snack/Dinner.
3. Lock the week and open Grocery list.
4. Set package size + price, alter **Packages purchased**, save, then mark the item purchased.
5. Confirm the real purchased grams appear in Pantry.
6. Flex → create a 3- or 6-day PPL plan.
7. Start today's workout, log sets, swap one exercise, and finish the workout.
