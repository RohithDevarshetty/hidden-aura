'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Question {
  id: string;
  questionText: string;
  username: string;
  answerCount: number;
  viewCount: number;
  createdAt: string;
}

export default function ExplorePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrendingQuestions = async () => {
      try {
        const response = await fetch('/api/explore/trending');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to load questions');
        }

        setQuestions(data.data.questions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-nord-0">
      {/* Navigation */}
      <nav className="border-b border-nord-2/30 bg-nord-2/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-frost-1 via-accent to-frost-0 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-cooper)' }}>
            HiddenAura
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-snow-2 mb-3">
              Trending Questions
            </h1>
            <p className="text-lg text-snow-0">
              Discover popular questions from the community
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-frost-1 border-r-transparent"></div>
              <p className="mt-4 text-snow-0">Loading questions...</p>
            </div>
          )}

          {error && (
            <div className="bg-aurora-red/10 border border-aurora-red text-aurora-red p-4 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-snow-0 mb-4">No trending questions yet</p>
                <Link href="/register">
                  <Button>Be the first to create a question</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {!loading && !error && questions.length > 0 && (
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="hover:shadow-lg hover:border-frost-1 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 text-snow-2">
                          {question.questionText}
                        </CardTitle>
                        <CardDescription>
                          Asked by{' '}
                          <Link
                            href={`/@${question.username}`}
                            className="text-frost-1 hover:underline font-medium"
                          >
                            @{question.username}
                          </Link>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm text-snow-0">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>{question.answerCount} answers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>{question.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
