import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByAccessCode } from './access-code';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'access-code',
      name: 'Access Code',
      credentials: {
        accessCode: { label: 'Access Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.accessCode) {
          throw new Error('Access code is required');
        }

        try {
          const user = await getUserByAccessCode(credentials.accessCode);

          if (!user) {
            throw new Error('Invalid access code');
          }

          return {
            id: user.id,
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub || user?.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
