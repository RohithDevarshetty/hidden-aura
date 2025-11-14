# Vercel Deployment Setup Guide

This guide will help you deploy HiddenAura to Vercel with Supabase PostgreSQL.

## Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with `hidden-aura` repository pushed
- ✅ Supabase project set up with PostgreSQL
- ✅ Google OAuth credentials
- ✅ Resend account with API key (optional for emails)

---

## Step 1: Get Your Supabase Connection String

1. Go to your Supabase project: https://app.supabase.com
2. Click **Settings** (bottom left)
3. Click **Database**
4. Under **Connection Pooling**, select **Session Mode**
5. Copy the connection string
6. It will look like:
   ```
   postgresql://postgres.[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres
   ```
7. Update `DATABASE_URL` in `env_vercel` file with this value

---

## Step 2: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and update `NEXTAUTH_SECRET` in `env_vercel`

---

---

## Step 3: Update env_vercel File

Edit the `env_vercel` file with your actual values:

```bash
# Update these values:
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
NEXTAUTH_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
DATABASE_URL=postgresql://postgres...
RESEND_API_KEY=re_YOUR_API_KEY
```

---

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select **GitHub** and import `hidden-aura`
4. Click **Deploy** (don't set env vars yet)
5. After deployment succeeds, you'll get a Vercel domain like:
   ```
   https://hidden-aura-xxxxx.vercel.app
   ```

### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## Step 5: Add Environment Variables to Vercel

After getting your Vercel domain:

1. Go to Vercel Dashboard → Your Project → **Settings**
2. Click **Environment Variables**
3. Copy all variables from `env_vercel` file
4. **Paste each variable** one by one:
   - Key: `DATABASE_URL`, Value: `postgresql://...`
   - Key: `NEXTAUTH_URL`, Value: `https://your-domain.vercel.app`
   - Key: `NEXTAUTH_SECRET`, Value: `your-secret`
   - Key: `RESEND_API_KEY`, Value: `re_xxx`
   - Key: `RESEND_FROM_EMAIL`, Value: `onboarding@resend.dev`

5. Click **Save** for each variable

---

## Step 6: Run Database Migrations

After adding environment variables, run migrations:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Connect to your Vercel project
vercel link

# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy

# Seed initial templates
npm run seed
```

Or run via GitHub commit (recommended):

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

Vercel will automatically redeploy when you push to main.

---

## Step 7: Test Your Deployment

Visit your Vercel domain and test:

- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Access code is displayed
- [ ] Can log in with access code
- [ ] Can create a question
- [ ] Can submit an answer
- [ ] Email notification sent (if configured)
- [ ] Dashboard shows questions
- [ ] Explore page shows trending questions

---

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct from Supabase
- Make sure Supabase project is running
- Check that connection pooling is enabled

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- For development, emails only work if recipient is verified in Resend

### Deployment Fails
- Check build logs in Vercel dashboard
- Verify all required environment variables are set
- Run `npm run build` locally to test

---

## Environment Variables Summary

| Variable | Required | Source |
|----------|----------|--------|
| `DATABASE_URL` | ✅ | Supabase Settings > Database |
| `NEXTAUTH_URL` | ✅ | Your Vercel domain |
| `NEXTAUTH_SECRET` | ✅ | Generate with openssl |
| `RESEND_API_KEY` | ❌ | Resend dashboard |
| `RESEND_FROM_EMAIL` | ❌ | Resend dashboard |
| Other variables | ❌ | Optional features |

---

## Next Steps

1. **Custom Domain**: Add your custom domain in Vercel Settings
2. **SSL Certificate**: Automatically provided by Vercel
3. **Analytics**: Enable Vercel Analytics for insights
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **Backups**: Configure automatic Supabase backups

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Prisma Docs**: https://prisma.io/docs
