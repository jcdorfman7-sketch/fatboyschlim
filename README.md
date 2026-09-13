# FatBoySchlim v0.6

Adds weekly lock-in state, meal-prep preferences, Flex navigation, practical ingredient amounts, and more beginner-friendly recipe guidance.

Run `v0.6_migration.sql` in Supabase before deploying the five web files.

## v0.6.1
- Shop is now the single Plan + Buy workflow.
- Eat only uses the locked weekly meal pool.
- Grocery list is promoted after lock-in.
- One primary store drives cart estimates.
- Actual prices can be entered and become store-specific price history for future estimates.
- `v0.6.1_migration.sql` adds preferred store and grocery pricing fields.
