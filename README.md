# FatBoySchlim v1.8 — Real Images, Batch 1

This is the first release that actually renders approved real, non-AI imagery from `media_assets`.

## Run first
You already ran `v1.8_IMAGE_DATABASE.sql`.

Now run:
`v1.8_IMAGE_BATCH_1.sql`

That marks the verified Batch 1 sources approved, so the frontend is allowed to display them.

## Then deploy
Add:
- `v1.8.js`
- `v1.8.css`

Replace:
- `index.html`
- `sw.js`

Keep all existing v1.5–v1.7.3 files.

## What will populate immediately
Where the database name matches the sourced record:
- real meal photos for the first macro-builder/meal batch
- real grocery photos for eggs, chicken breast, yogurt, cottage cheese, cucumber, oats and canned tuna
- real exercise movement frames for the first core PPL batch

Exercise cards show START / MID / END. A missing middle source says `Photo pending` rather than showing a fake image.

## Important
This is not the entire 300+ meal / whole grocery / whole exercise library yet. The system is now live and real images will populate for every approved sourced row. Remaining items stay intentionally blank until they are sourced and approved.
