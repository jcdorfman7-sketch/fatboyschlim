# FatBoySchlim v0.1

Mobile-first PWA foundation with Supabase authentication and cloud-saved weight tracking.

## 1. Set up Supabase
1. Open your FatBoySchlim project in Supabase.
2. Open **SQL Editor** and create a new query.
3. Paste the complete contents of `supabase_setup.sql` and click **Run**.
4. In **Authentication**, email/password authentication should be enabled. Supabase may require email confirmation by default; that is fine.

## 2. Upload to GitHub
Upload these files to the root of the empty `fatboyschlim` repository:
- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- README.md
- supabase_setup.sql

## 3. Turn on GitHub Pages
In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**. Choose the `main` branch and `/ (root)`, then Save.

## 4. Test
Open the GitHub Pages URL, create an account, log in, and enter a weight. Refresh/reopen the page; the entry should still be present.

The Supabase URL and publishable key in `app.js` are frontend/public credentials. Never place a Supabase secret/service-role key in this repository.
