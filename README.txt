FatBoySchlim v1.9.0 — Performance + Media Runtime

WHAT THIS PACKAGE DOES
- Replaces the old always-running media MutationObserver.
- Refreshes media only after a screen is rendered.
- Loads media metadata once and caches it for 15 minutes.
- Caches the recipe catalog for 5 minutes.
- Recipe Library renders 24 cards per page instead of 100+ at once.
- Recipe search is debounced.
- Images use lazy loading + async decoding.
- Service worker has separate static and image caches.
- Adds Supabase indexes for the most common user/week/date lookups.
- Uses local_path first, remote_url second, so bundled/local media can be migrated in without rewriting the renderer.

INSTALL
1. Run v1.9_PERFORMANCE_INDEXES.sql in Supabase.
2. Upload index.html and sw.js to the repo root, replacing the old files.
3. Upload v1.9.js and v1.9.css to the repo root.
4. Do NOT load v1.8.4b.js or v1.8.3b.js alongside v1.9.js.
5. Wait for GitHub Pages, then fully close/reopen the PWA.

MEDIA
This package improves how images load, but it does NOT falsely claim every recipe/exercise has a verified image.
Run v1.9_MEDIA_AUDIT.sql to see exactly what is still missing.
The 1.9 renderer already supports local repo images through media_assets.local_path, which is the target format for the final completed media library.

WHY THIS IS FASTER
The previous media system watched essentially every DOM mutation and repeatedly rescanned cards.
1.9 removes that behavior. It also stops the 300+ recipe library from creating a huge DOM all at once.
