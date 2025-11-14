# Complete Setup Guide

This guide will walk you through setting up the Anonymous Q&A Platform from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database access (or create a free Supabase account)
- npm or yarn package manager
- (Optional) Redis database (Upstash offers a free tier)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Navigate to the project directory
cd anonymous-qa

# Install dependencies
npm install

# This will install all required packages including:
# - Next.js, React, TypeScript
# - Prisma, @prisma/client
# - NextAuth.js
# - Tailwind CSS
# - And many more...
```

### 2. Database Setup (PostgreSQL)

#### Option A: Using Supabase (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned
4. Go to Settings → Database
5. Copy the "Connection string" (URI format)
6. Replace `[YOUR-PASSWORD]` with your database password

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database:
   ```bash
   createdb anonymous_qa
   ```
3. Your connection string will be:
   ```
   postgresql://username:password@localhost:5432/anonymous_qa
   ```

### 3. Redis Setup (Optional but Recommended)

#### Using Upstash (Free Tier Available)

1. Go to [upstash.com](https://upstash.com) and create an account
2. Create a new Redis database
3. Select a region close to your application
4. Copy the "REST URL" and "REST TOKEN"

**Note:** If you skip Redis setup, the app will still work, but rate limiting will be disabled (not recommended for production).

### 4. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the following **required** variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AnonAsk

# Database (from Step 2)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth (generate a secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# How to generate NEXTAUTH_SECRET:
# Run this command: openssl rand -base64 32
# Or visit: https://generate-secret.vercel.app/32
```

#### Optional but Recommended Variables:

```bash
# Redis (from Step 3) - For rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Resend) - For notifications
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Captcha (hCaptcha) - For spam prevention
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
```

### 5. Database Migration

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Create the initial migration
npx prisma migrate dev --name init

# This will:
# - Create all tables (users, questions, answers, etc.)
# - Set up indexes
# - Apply constraints
```

**Verify the migration:**
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This will open a browser at `http://localhost:5555` where you can see all your tables.

### 6. Start the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

You should see:
- ✓ Ready in XXms
- ○ Compiling / ...
- ✓ Compiled / in XXms

### 7. Test the Application

1. Open http://localhost:3000
2. Click "Get Started"
3. Choose a username (e.g., "testuser")
4. You'll receive an access code (save it!)
5. Create your first question
6. Copy your profile link
7. Open the link in an incognito window to test anonymous answering

## Setting Up External Services

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### Resend Email Setup

1. Go to [resend.com](https://resend.com)
2. Create an account
3. Verify your domain (or use the test domain for development)
4. Create an API key
5. Copy the API key to `.env.local`

### hCaptcha Setup

1. Go to [hcaptcha.com](https://www.hcaptcha.com)
2. Create an account
3. Add a new site
4. Copy the Site Key and Secret Key to `.env.local`

## Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"
```bash
# Check if PostgreSQL is running
# For Supabase: Check if your IP is whitelisted
# For local: sudo service postgresql status
```

**Error:** "Authentication failed"
```bash
# Double-check your DATABASE_URL
# Make sure the password is correct
# For Supabase: Use the "Connection pooling" URL for serverless
```

### Prisma Issues

**Error:** "Prisma Client not generated"
```bash
npx prisma generate
```

**Error:** "Migration failed"
```bash
# Reset the database (CAUTION: Deletes all data)
npx prisma migrate reset

# Then try again
npx prisma migrate dev
```

### Port Already in Use

**Error:** "Port 3000 is already in use"
```bash
# Find and kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# Or use a different port:
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Restart the dev server
npm run dev
```

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
6. Deploy

**Important:**
- Use "Connection Pooling" URL from Supabase for DATABASE_URL
- Set NODE_ENV=production
- Run migrations: `npx prisma migrate deploy`

### Database Migrations in Production

```bash
# DO NOT use `migrate dev` in production
# Instead, use:
npx prisma migrate deploy
```

## Next Steps

After successful setup:

1. **Customize Branding**
   - Update `NEXT_PUBLIC_APP_NAME` in `.env.local`
   - Modify colors in `tailwind.config.ts`
   - Add your logo to `public/` folder

2. **Test All Features**
   - User registration
   - Question creation
   - Anonymous answering
   - Image generation
   - Email notifications (if configured)

3. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor rate limits

4. **Security Checklist**
   - ✓ Environment variables are secret
   - ✓ Database credentials are secure
   - ✓ Rate limiting is enabled (Redis)
   - ✓ CAPTCHA is configured
   - ✓ HTTPS is enabled (automatic on Vercel)

## Development Tips

### Useful Commands

```bash
# Database
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create and apply migration
npx prisma db seed            # Seed database
npx prisma db pull            # Pull schema from database
npx prisma db push            # Push schema to database (dev only)

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Lint code
npm run type-check            # Check TypeScript

# Clean
rm -rf .next                   # Clear Next.js cache
rm -rf node_modules           # Remove dependencies
npm install                    # Reinstall dependencies
```

### Hot Reload Not Working?

1. Check if file is in the correct directory
2. Restart the dev server
3. Clear `.next` folder: `rm -rf .next`

### Adding New Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name

# Always commit package.json and package-lock.json
```

## Getting Help

- Check the [README.md](./README.md) for feature documentation
- Open an issue on GitHub for bugs
- Join the Discord community (if available)
- Email support@anonask.com

## Success Checklist

- [ ] Dependencies installed
- [ ] Database connected
- [ ] Environment variables configured
- [ ] Migrations applied
- [ ] Dev server running
- [ ] Can create a user
- [ ] Can create a question
- [ ] Can submit an answer
- [ ] Images generate correctly

If all items are checked, you're ready to go! 🎉
