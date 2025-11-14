# Deployment Guide for HiddenAura

This guide will help you deploy HiddenAura to production using Vercel and Railway.

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free tier available)
- Resend account with API key
- Google OAuth credentials (for sign-in)

---

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

## Step 2: Set Up PostgreSQL Database on Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up or log in with GitHub
3. Click **New Project**
4. Click **Provision PostgreSQL**
5. Wait for the database to be created
6. Click on the PostgreSQL service
7. Go to **Connect** tab
8. Copy the **Postgres Connection URL**

You'll need this URL for the next step.

---

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository
1. Go to [Vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **Import Project**
4. Select your GitHub repository
5. Click **Import**

### 3.2 Configure Environment Variables
After clicking Import, Vercel will ask you to add environment variables. Add these:

```
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
# (Copy the full PostgreSQL URL from Railway)

# NextAuth
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
# Generate a secret: openssl rand -base64 32

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Resend Email
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
# (Or your custom domain once verified in Resend)
```

---

## Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   ```
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```
6. Copy `Client ID` and `Client Secret` to Vercel environment variables

---

## Step 5: Run Database Migrations

After deploying to Vercel, run migrations:

```bash
# Connect to your Vercel deployment
vercel env pull

# Run Prisma migrations
npx prisma migrate deploy

# Seed initial data (templates)
npx prisma db seed
```

Or run via Vercel CLI:

```bash
vercel env pull
npx prisma migrate deploy
```

---

## Step 6: Set Up Resend for Production

1. Go to [Resend.com](https://resend.com)
2. Create an account or log in
3. Copy your API key
4. Add to Vercel environment variables as `RESEND_API_KEY`

### Optional: Add Custom Domain for Emails
1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `your-domain.com`)
3. Follow DNS verification steps
4. Update `RESEND_FROM_EMAIL` in Vercel to `noreply@your-domain.com`

---

## Step 7: Deploy

1. Click **Deploy** in Vercel
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test access code login
- [ ] Test Google OAuth sign-in
- [ ] Create a test question
- [ ] Submit an answer
- [ ] Check email notification (if email configured)
- [ ] Test download story feature
- [ ] Test profile sharing
- [ ] Check database is connected (view questions in dashboard)

---

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format:
# postgresql://user:password@host:port/database

# Test connection:
psql your_database_url
```

### Email Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check if recipient email is verified in Resend (for development)
- Check server logs in Vercel

### Google OAuth Not Working
- Verify redirect URI matches exactly in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Deployment Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `prisma/schema.prisma` is correct

---

## Environment Variables Summary

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ |
| `NEXTAUTH_URL` | `https://app.vercel.app` | ✅ |
| `NEXTAUTH_SECRET` | Generated via `openssl rand -base64 32` | ✅ |
| `GOOGLE_CLIENT_ID` | From Google Console | ✅ |
| `GOOGLE_CLIENT_SECRET` | From Google Console | ✅ |
| `RESEND_API_KEY` | From Resend dashboard | ❌ (optional for emails) |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | ❌ (if using Resend) |

---

## Next Steps

1. **Custom Domain**: Add your domain in Vercel settings
2. **Analytics**: Enable Vercel analytics for insights
3. **Monitoring**: Set up error tracking (Sentry, etc.)
4. **Backups**: Configure database backups on Railway
5. **SSL/HTTPS**: Automatically handled by Vercel

---

## Support

For issues with:
- **Vercel**: [Vercel Docs](https://vercel.com/docs)
- **Railway**: [Railway Docs](https://docs.railway.app)
- **Prisma**: [Prisma Docs](https://www.prisma.io/docs)
- **Resend**: [Resend Docs](https://resend.com/docs)
