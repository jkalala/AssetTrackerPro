# Complete Setup Guide for AssetTracker Pro

This guide will walk you through setting up AssetTracker Pro with a real Supabase database.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- Git installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `AssetTracker Pro`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase credentials

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned" message

## Step 5: Configure Authentication

### Email Authentication (Already Enabled)
Email auth is enabled by default. Users can sign up with email/password.

### GitHub OAuth (Optional)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `AssetTracker Pro`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the Client ID and Client Secret
6. In Supabase dashboard, go to Authentication → Providers
7. Enable GitHub provider
8. Enter your GitHub Client ID and Client Secret
9. Save the configuration

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Configure OAuth consent screen if needed
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase dashboard, go to Authentication → Providers
9. Enable Google provider
10. Enter your Google Client ID and Client Secret
11. Save the configuration

## Step 6: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. You should see the AssetTracker Pro login page
4. Try signing up with email or OAuth providers
5. After successful login, you should see the dashboard

## Step 7: Verify Database Tables

1. In Supabase dashboard, go to Table Editor
2. You should see the following tables:
   - `profiles`
   - `assets`
   - `asset_history`
   - `teams`
   - `team_members`

## Step 8: Test Core Features

### Test User Registration
1. Sign up with a new email
2. Check that a profile is created in the `profiles` table

### Test Asset Creation
1. Click "Add Asset" in the dashboard
2. Fill out the asset form
3. Submit and verify the asset appears in the `assets` table

### Test QR Code Generation
1. Go to QR Code Tools tab
2. Select an asset and generate a QR code
3. Verify the QR code is saved to the asset

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Make sure all dependencies are installed: `npm install`
- Restart the development server

**Authentication not working**
- Verify your environment variables are correct
- Check that the `.env.local` file is in the project root
- Restart the development server after adding env vars

**Database connection issues**
- Verify your Supabase URL and key are correct
- Check that the migration was run successfully
- Ensure RLS policies are enabled

**OAuth not working**
- Verify callback URLs match exactly
- Check that OAuth apps are configured correctly
- Ensure Supabase auth providers are enabled

### Getting Help

1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Make sure the database migration completed successfully

## Production Deployment

### Environment Variables for Production

When deploying to production, update your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Update OAuth Redirect URLs

1. Update GitHub OAuth app with production URL
2. Update Google OAuth app with production URL
3. Update Supabase auth settings if needed

### Vercel Deployment

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Security Considerations

1. Never commit `.env.local` to version control
2. Use environment variables for all sensitive data
3. Regularly rotate API keys
4. Monitor Supabase usage and logs
5. Keep dependencies updated

## Next Steps

Once everything is working:

1. Customize the branding and styling
2. Add more asset categories
3. Set up team workflows
4. Configure email templates in Supabase
5. Set up monitoring and analytics
6. Plan your production deployment

Congratulations! You now have a fully functional AssetTracker Pro installation with real database connectivity.