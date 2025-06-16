# Database Setup Guide

## Quick Fix for Policy Conflicts

If you're getting the error "policy already exists", use this clean migration instead:

### Step 1: Use the Clean Migration

Instead of running the original migration, use the new file:
`supabase/migrations/002_fix_existing_policies.sql`

This migration:
- ✅ Safely handles existing policies
- ✅ Drops and recreates all policies cleanly
- ✅ Ensures all tables and functions are properly set up
- ✅ Provides verification output

### Step 2: Run the Migration

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/002_fix_existing_policies.sql`
4. Paste and run it
5. You should see success messages with counts of created objects

### Step 3: Verify Setup

After running the migration, you should see:
- ✅ 5 tables created (profiles, assets, asset_history, teams, team_members)
- ✅ 10+ policies created for row-level security
- ✅ 3 functions created for automation

### What This Migration Does

1. **Safely Creates Tables**: Uses `IF NOT EXISTS` to avoid conflicts
2. **Cleans Up Policies**: Drops existing policies before recreating them
3. **Sets Up Security**: Enables RLS and creates proper policies
4. **Adds Functions**: Creates triggers for automatic profile creation
5. **Verifies Setup**: Provides feedback on what was created

### Troubleshooting

**If you still get errors:**
1. Make sure you're using the new migration file (`002_fix_existing_policies.sql`)
2. Check that you have proper permissions in Supabase
3. Try running the migration in smaller chunks if needed

**To start completely fresh:**
If you want to start over completely, you can:
1. Go to Table Editor in Supabase
2. Delete all tables manually
3. Then run the migration

### Next Steps

Once the migration runs successfully:
1. ✅ Your database is ready
2. ✅ Start your app with `npm run dev`
3. ✅ Test user registration and asset creation
4. ✅ All features should work properly

The app will automatically detect your Supabase connection and switch from demo mode to real database mode!