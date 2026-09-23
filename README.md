# FatBoySchlim v0.9.1

Adaptive training + weekly review release.

## Install
1. In Supabase SQL Editor, run `v0.9.1_migration.sql` with RLS.
2. Replace the five GitHub Pages files: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`.
3. Hard-refresh or reopen the installed PWA after GitHub Pages finishes deploying.

## Major changes
- Flex setup now includes primary goal, weak points, training challenges, experience level, weight unit, session length and rest preferences.
- Generated workouts alter sets/rep ranges by goal and add volume to priority muscles.
- Suggested load uses your own previous performance; unseen exercises use an effort/RIR starting rule rather than a fabricated weight.
- Live sets support effort, RIR and pain flags.
- Automatic rest timer after saved sets.
- Exercise history screens and progression notes.
- Weekly workout adherence display.
- 7-day Progress review for calories, protein, workouts, grocery spend and use-soon pantry items.
- Recipe image database now has explicit approval/alt/prompt fields so only approved exact/close photos should be shown.

## Photo note
The app's photo schema and approval gate are ready, but the 100+ exact recipe photographs are a separate asset-production pass. Wrong/random images remain blocked rather than being substituted.
