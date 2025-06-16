# Quick Start Guide - Real Database Setup

## 🚀 Get Up and Running in 5 Minutes

### 1. Create Supabase Project (2 minutes)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: "AssetTracker Pro"
3. Generate password → Create project
4. Wait for setup to complete

### 2. Get Your Credentials (1 minute)
1. Go to Settings → API in your Supabase dashboard
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 3. Add Environment Variables (30 seconds)
Create `.env.local` in your project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database (1 minute)
1. Go to SQL Editor in Supabase
2. Copy contents of `supabase/migrations/002_fix_existing_policies.sql`
3. Paste and click "Run"
4. Look for "Migration completed successfully!" message

### 5. Start Your App (30 seconds)
```bash
npm run dev
```

### 6. Test Everything! 🎉
1. Open `http://localhost:3000`
2. Sign up with email
3. Add your first asset
4. Generate a QR code
5. Explore all features!

## ✅ What You Get

- **Real Database**: All data persists
- **User Authentication**: Email + OAuth
- **Asset Management**: Full CRUD operations
- **QR Code System**: Generate and scan
- **Team Features**: User roles and permissions
- **Security**: Row-level security enabled

## 🔧 Troubleshooting

**Policy errors?** → Use the new migration file `002_fix_existing_policies.sql`

**Auth not working?** → Check your `.env.local` file and restart the dev server

**Can't add assets?** → Make sure the migration ran successfully

## 🚀 Production Ready

This setup is production-ready! Just:
1. Deploy to Vercel/Netlify
2. Add production environment variables
3. Update OAuth redirect URLs
4. You're live! 🎉

---

**Need help?** Check the full setup guide in `docs/SETUP_GUIDE.md`