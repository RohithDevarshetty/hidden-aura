#!/bin/bash

# HiddenAura Production Setup Script
# This script helps you prepare for production deployment

set -e

echo "🚀 HiddenAura Production Setup"
echo "================================"
echo ""

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Warning: You have uncommitted changes"
  echo "   Commit or stash changes before deploying"
  exit 1
fi

echo "✅ Git status clean"
echo ""

# Check for required files
echo "🔍 Checking for required files..."

files=(
  "package.json"
  "prisma/schema.prisma"
  ".env.example"
  "lib/auth/next-auth.config.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    exit 1
  fi
done

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Before deploying, ensure you have:"
echo ""
echo "1. Database Setup:"
echo "   [ ] Railway PostgreSQL instance created"
echo "   [ ] DATABASE_URL copied from Railway"
echo ""
echo "2. Vercel Setup:"
echo "   [ ] GitHub repository created"
echo "   [ ] Vercel project linked to GitHub"
echo ""
echo "3. Authentication:"
echo "   [ ] NEXTAUTH_SECRET generated (run: openssl rand -base64 32)"
echo "   [ ] NEXTAUTH_URL set to your Vercel domain"
echo "   [ ] Google OAuth credentials obtained"
echo "   [ ] Google OAuth redirect URI configured"
echo ""
echo "4. Email (Optional but recommended):"
echo "   [ ] Resend account created"
echo "   [ ] RESEND_API_KEY obtained"
echo ""

echo ""
echo "🔐 Environment Variables Quick Setup:"
echo "====================================="
echo ""
echo "Run this command to generate NEXTAUTH_SECRET:"
echo "  openssl rand -base64 32"
echo ""

echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Set up PostgreSQL on Railway:"
echo "   https://railway.app"
echo ""
echo "2. Deploy to Vercel:"
echo "   https://vercel.com/import"
echo ""
echo "3. Add environment variables in Vercel dashboard"
echo ""
echo "4. After deployment, run migrations:"
echo "   vercel env pull"
echo "   npx prisma migrate deploy"
echo "   npx prisma db seed"
echo ""

echo "✨ For detailed instructions, see DEPLOYMENT.md"
