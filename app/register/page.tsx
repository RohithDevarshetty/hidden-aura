'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: email || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      const newAccessCode = data.data.accessCode;

      // Show the access code screen first (don't auto sign in yet)
      setAccessCode(newAccessCode);

      // Auto sign in in the background
      const signInResult = await signIn('access-code', {
        accessCode: newAccessCode,
        redirect: false,
      });

      if (!signInResult?.ok) {
        throw new Error('Account created but auto sign-in failed. Please try logging in manually.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (accessCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nord-0 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Registration Successful!</CardTitle>
            <CardDescription>Save your access code - you&apos;ll need it to log in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-frost-1/20 p-6 rounded-lg text-center border border-frost-0">
              <p className="text-sm text-snow-0 mb-2">Your Access Code</p>
              <p className="text-3xl font-mono font-bold text-frost-1 tracking-wider">{accessCode}</p>
            </div>
            <div className="bg-aurora-yellow/10 border border-aurora-yellow p-4 rounded-lg">
              <p className="text-sm text-nord-0">
                <strong>Important:</strong> Save this code securely. You&apos;ll need it to log in to your account.
                We don&apos;t store passwords - only this access code.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-snow-2">Your profile link:</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/@${username}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/@${username}`);
                  }}
                  variant="outline"
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nord-0 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Choose a username and start receiving anonymous messages</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-aurora-red/10 border border-aurora-red text-aurora-red p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-snow-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9_]+"
                disabled={loading}
              />
              <p className="text-xs text-snow-1">
                3-30 characters, lowercase letters, numbers, and underscores only
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-snow-2">
                Email (optional)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-snow-1">
                Optional - only used for notifications
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-snow-0">
              Already have an account?{' '}
              <Link href="/login" className="text-frost-1 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
