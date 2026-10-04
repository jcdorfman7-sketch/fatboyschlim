# FatBoySchlim v1.7 — Smart Training Coach + Visual Refresh

## Install
1. Run `v1.7_ALL_IN_ONE.sql` in Supabase with RLS enabled.
2. Keep your existing `app.js`, `styles.css`, `v1.6.js`, and `v1.6.css`.
3. Upload/replace `index.html`, `sw.js`, and `manifest.webmanifest`.
4. Add `v1.7.js`, `v1.7.css`, and the entire `assets/` folder.
5. Hard refresh once after GitHub Pages deploys.

## What changed
- Smart exercise replacement ranked by muscle, movement pattern, equipment and preferences.
- Choose a replacement for one workout or save it as the permanent substitute.
- Favorite or avoid exercises.
- Adapt Today modes: normal, short on time, low energy, joint issue, crowded gym.
- Saved substitutions are automatically applied to future generated workouts.
- Visual system for recipes, groceries and exercises, with database image URL fields plus bundled branded fallbacks.
- Distinct page identities: Today warm coral, Eat green, Shop cyan, Flex purple, Progress amber.
- FBS watermark treatment on every main page.
- More fluid heroes, cards, transitions and page grouping.

## Image note
v1.7 adds the full image architecture and branded fallback artwork everywhere. Existing exact/close recipe photography is still respected. Grocery and exercise records can now receive exact image URLs without another frontend rewrite. The bundled fallback art is deliberately marked as placeholder artwork; it is not pretending to be an exact food/product/exercise demonstration.
