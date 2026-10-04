# FatBoySchlim v1.8.2 — Exercise image flashing hotfix

I inspected the supplied screen recording. The flashing is a renderer feedback loop:

- v1.7 sees no `.v17ExerciseImage` and creates the old graphic.
- v1.8/v1.8.1 removes it and creates the 3-frame strip.
- v1.7's MutationObserver notices that DOM change and creates the old graphic again.
- the later renderer notices that change, removes it again.
- repeat.

The broken-image icon visible in the recording is a separate issue: some remote Wikimedia URLs are not loading.

## Install
1. Add `v1.8.2.js`
2. Add `v1.8.2.css`
3. Replace `index.html`
4. Replace `sw.js`

## Important
The replacement index intentionally DOES NOT load:
- `v1.7.3.js`
- `v1.8.js`
- `v1.8.1.js`

Do not add those script tags back.

Their CSS files can remain loaded.

## What this fixes
- One renderer owns the media UI.
- The legacy v1.7 image element remains hidden in the DOM as a sentinel, preventing v1.7 from recreating it.
- DOM updates are idempotent rather than constantly rebuilt.
- Broken remote images settle to `Photo unavailable`.
- Missing genuine frames settle to `Photo pending`.
- No more cycling between stock graphic / pending / unknown.

No SQL changes are required for this hotfix.
