# Anonymous Q&A Platform

A modern, Instagram-optimized platform for receiving anonymous answers from followers. Built with Next.js 14, TypeScript, Prisma, and Supabase.

## Features

- 🔒 **100% Anonymous** - Complete privacy for respondents
- 📱 **Mobile-First Design** - Optimized for Instagram users
- 🎨 **Beautiful Story Images** - Generate shareable story templates
- ⚡ **Instant Notifications** - Email and push notifications
- 🚀 **No Signup Required** - Quick access with access codes
- 🔐 **Google OAuth** - Optional account upgrade
- 📊 **Analytics** - Track engagement and answers
- 🎭 **Multiple Templates** - Customizable story designs

## Tech Stack

- **Next.js 14** with TypeScript and App Router
- **Prisma** ORM with PostgreSQL
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **Redis** (Upstash) for rate limiting
- **Satori** & **Sharp** for image generation
- **Resend** for email notifications

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in the required variables (at minimum: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`).

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
anonymous-qa/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Protected pages
│   └── @[username]/       # Public profiles
├── components/            # React components
├── lib/                  # Utilities & libraries
├── prisma/              # Database schema
└── types/               # TypeScript definitions
```

## Key Features Implementation

### Authentication
- Access code system (no password required)
- Google OAuth integration
- NextAuth.js session management

### Rate Limiting
- Device fingerprint-based limiting
- IP-based rate limiting
- Redis-powered with graceful fallback

### Image Generation
- Satori for React-to-image conversion
- Multiple customizable templates
- Instagram story optimized (1080x1920)

### Spam Prevention
- hCaptcha integration
- Device fingerprinting
- Multi-layer rate limiting

## API Routes

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login/code` - Login with access code
- `GET /api/questions/check-username` - Check availability

### Questions & Answers
- `POST /api/questions` - Create question
- `GET /api/questions` - List questions
- `POST /api/questions/[id]/answers` - Submit answer
- `GET /api/answers` - Get received answers

### Other
- `GET /api/profile/[username]` - Public profile
- `GET /api/explore/trending` - Trending questions
- `POST /api/images/generate/question` - Generate story image

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Required Services

- **Database**: PostgreSQL (Supabase recommended)
- **Redis**: Upstash (optional but recommended)
- **Email**: Resend (optional)
- **Captcha**: hCaptcha (optional)

## Environment Variables

See `.env.example` for all variables. Required:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Your app URL

## Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npx prisma studio    # Open database GUI
```

## Security

- Rate limiting on all sensitive endpoints
- CAPTCHA verification for anonymous submissions
- Device fingerprinting for spam prevention
- IP address hashing for privacy
- Input sanitization and validation
- Secure session management

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please create an issue on GitHub.
