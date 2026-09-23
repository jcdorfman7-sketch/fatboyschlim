# FatBoySchlim v1.0 — Integrated Weekly Coach

v1.0 turns the existing food, shopping, pantry, training and progress systems into one coherent weekly workflow.

## New in v1.0
- Polished bottom navigation that looks and behaves like a real app button bar, with a clearly highlighted active page.
- New Settings hub for nutrition/goals, Flex, pantry/shopping and weekly planning.
- New Weekly Coach flow: goals → meals → groceries/pantry → Flex → lock week.
- New Today control center with remaining macros, today's meals, training status, weight check-in and coach recommendations.
- Week-to-week coaching signals based on recent weight trend, calorie/protein adherence, workout adherence and use-soon pantry items.
- Progress page now tells the story of the week instead of only showing raw logs.
- UI polish across cards, status pills, quick actions and mobile navigation.
- Cache bumped to v1.0.

## Install
No new database migration is required for v1.0 if v0.9.1 migration completed successfully.

Replace these five files on GitHub:
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js

## Recipe imagery
The app continues to enforce Exact / Close / Placeholder image status. v1.0 does not reintroduce generic mismatched food photography. The exact-recipe photo asset production pass remains a separate content task; the included recipe_photo_manifest.csv remains the source checklist and does not need to be uploaded to GitHub or Supabase.
