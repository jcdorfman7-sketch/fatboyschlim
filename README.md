# FatBoySchlim v1.8.1 — Exact exercise images

This corrects the random/wrong exercise-image problem.

Install:
1. Run `v1.8.1_EXACT_IMAGE_BATCH.sql` in Supabase.
2. Add `v1.8.1.js` and `v1.8.1.css`.
3. Load the CSS after v1.8.css and the JS after v1.8.js.
4. Bump the service-worker cache.

Rules:
- All earlier exercise images marked `close` are disabled.
- Known bad Skull Crusher / Reverse Pec Deck substitutions are disabled.
- Only verified same-movement sources are approved.
- MID stays pending unless a genuine third frame exists.
