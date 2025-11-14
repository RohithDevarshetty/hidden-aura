'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';

interface Question {
  id: string;
  questionText: string;
  answerCount: number;
  viewCount: number;
  createdAt: string;
}

interface ProfileData {
  username: string;
  bio?: string;
  totalQuestions: number;
  totalAnswersReceived: number;
  createdAt: string;
  questions: Question[];
}

export default function ProfilePage() {
  const params = useParams();
  const username = (params?.username as string)?.replace('@', '');

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load profile');
      }

      setProfile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateDeviceFingerprint = async (): Promise<string> => {
    // Simple device fingerprint based on browser data
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${new Date().getTimezoneOffset()}`;
    return btoa(fingerprint);
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !answer.trim()) return;

    setSubmitting(true);

    try {
      const deviceFingerprint = await generateDeviceFingerprint();

      const response = await fetch(`/api/questions/${selectedQuestion.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerText: answer,
          captchaToken: 'disabled',
          deviceFingerprint,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit answer');
      }

      setSubmitSuccess(true);
      setAnswer('');

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedQuestion(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nord-0">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-snow-0">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nord-0 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nord-0">
      {/* Navigation */}
      <nav className="border-b border-nord-2 bg-nord-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-heading font-bold text-primary">
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">@{profile.username}</CardTitle>
              {profile.bio && <CardDescription className="text-base">{profile.bio}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 text-sm text-snow-0">
                <span>{profile.totalQuestions} questions</span>
                <span>{profile.totalAnswersReceived} answers received</span>
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Answer Modal */}
          {selectedQuestion && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Answer Anonymously</CardTitle>
                <CardDescription>{selectedQuestion.questionText}</CardDescription>
              </CardHeader>
              {submitSuccess ? (
                <CardContent className="py-12 text-center">
                  <div className="text-green-600 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Answer submitted!</p>
                  <p className="text-sm text-snow-0 mt-2">Your anonymous answer has been sent.</p>
                </CardContent>
              ) : (
                <form onSubmit={handleAnswerSubmit}>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Write your answer anonymously..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      maxLength={500}
                      rows={4}
                      disabled={submitting}
                    />
                    <p className="text-sm text-snow-1">
                      {answer.length}/500 characters • Your answer will be completely anonymous
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={submitting || !answer.trim()}>
                      {submitting ? 'Submitting...' : 'Submit Answer'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedQuestion(null);
                        setAnswer('');
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          )}

          {/* Questions List */}
          <div>
            <h2 className="text-2xl font-heading font-bold mb-4 text-nord-0">Questions</h2>
            {profile.questions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-snow-0">
                  No questions yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {profile.questions.map((question) => (
                  <Card key={question.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{question.questionText}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm text-snow-0">
                          <span>{question.answerCount} answers</span>
                          <span>{question.viewCount} views</span>
                          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedQuestion(question);
                            // Track view when user clicks to answer this specific question
                            fetch(`/api/questions/${question.id}`).catch(err =>
                              console.error('Failed to track question view:', err)
                            );
                          }}
                          disabled={selectedQuestion?.id === question.id}
                        >
                          Answer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
