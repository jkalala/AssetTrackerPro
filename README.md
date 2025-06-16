# AssetTracker Pro

A comprehensive asset management system with QR code integration, built with Next.js and Supabase.

## Features

- 🏷️ **Asset Management**: Track and manage all your assets with detailed information
- 📱 **QR Code Integration**: Generate and scan QR codes for instant asset access
- 👥 **Team Collaboration**: Role-based access and team management
- 🔒 **Security**: Row-level security with Supabase
- 📊 **Analytics**: Real-time dashboards and reporting
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd assettracker-pro
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

Run the migration file in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

### 4. Configure Authentication (Optional)

For GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth app with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
3. Add the Client ID and Secret to your Supabase Auth settings

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles extending Supabase auth
- **assets**: Asset information with QR codes
- **asset_history**: Audit trail for changes
- **teams**: Team management
- **team_members**: Team membership

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Optional:
- `NEXT_PUBLIC_APP_URL`: Your app URL (for QR codes)

## Features Overview

### Asset Management
- Create, read, update assets
- Categorization and status tracking
- Assignment to team members
- Value and warranty tracking

### QR Code System
- Generate QR codes for assets
- Bulk QR code generation
- Mobile scanning capability
- Direct asset access via QR

### Team Collaboration
- User roles (admin, manager, user)
- Team creation and management
- Asset assignment
- Activity tracking

### Security
- Row-level security (RLS)
- Role-based access control
- Secure authentication with Supabase
- Audit trails

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **QR Codes**: qrcode library
- **Deployment**: Vercel (recommended)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js and Supabase