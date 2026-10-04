# FatBoySchlim v1.7.3 navigation repair

This replaces the broken v1.7.2 navigation behavior shown in the desktop screenshot.

## Fixes
- Bottom menu is a true 5-column full-width bar.
- Removes the v1.7 generic orange button gradient from inactive nav buttons.
- Active tab gets the page accent color with dark readable text.
- Inactive tab text is bright on the dark bar.
- Forces the bar to the viewport bottom with no inherited transform/max-width.
- Keeps all content underneath the navigation stacking layer.
- Removes references to missing `v1.7.1.css` / `v1.7.1.js` files from `index.html` and the service-worker cache list.
- Carries forward the honest "Photo coming soon" behavior instead of unrelated fallback graphics.

## Install
1. Add `v1.7.3.css`
2. Add `v1.7.3.js`
3. Replace `index.html`
4. Replace `sw.js`

No SQL changes.
