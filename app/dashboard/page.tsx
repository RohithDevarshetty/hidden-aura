'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { StoryTemplateGenerator } from '@/components/StoryTemplateGenerator';
import { ReportModal } from '@/components/ReportModal';

interface Question {
  id: string;
  questionText: string;
  isPublic: boolean;
  answerCount: number;
  viewCount: number;
  createdAt: string;
}

interface Answer {
  id: string;
  answerText: string;
  questionId: string;
  question: {
    questionText: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyData, setStoryData] = useState<{ type: 'question' | 'answer'; text: string; answer?: string } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportAnswerId, setReportAnswerId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.name) {
      fetchUserData(session.user.name);
    }
  }, [status, session, router]);

  const fetchUserData = async (username: string) => {
    try {
      // Fetch user's questions
      const questionsRes = await fetch(`/api/questions?username=${username}`);
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(questionsData.data?.questions || []);
      }

      // Fetch user's received answers
      const answersRes = await fetch('/api/answers');
      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setAnswers(answersData.data?.answers || []);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText: newQuestion, isPublic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create question');
      }

      // Add new question to the list
      setQuestions([data.data.question, ...questions]);
      setNewQuestion('');
      setIsPublic(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCreating(false);
    }
  };

  const copyProfileLink = () => {
    if (session?.user?.name) {
      navigator.clipboard.writeText(`${window.location.origin}/@${session.user.name}`);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to delete question');
      }

      // Remove question from list
      setQuestions(questions.filter((q) => q.id !== questionId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting question:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-frost-1 border-r-transparent"></div>
          <p className="mt-4 text-snow-0">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nord-0">
      {/* Navigation */}
      <nav className="border-b border-nord-2 bg-nord-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-frost-1 via-accent to-frost-0 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-cooper)' }}>
            HiddenAura
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-snow-0">@{session?.user?.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 animate-page-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Link */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile Link</CardTitle>
              <CardDescription>Share this link to receive anonymous messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/@${session?.user?.name}`}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyProfileLink}>Copy</Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Question */}
          <Card>
            <CardHeader>
              <CardTitle>Create a Question</CardTitle>
              <CardDescription>Ask a question for your followers to answer anonymously</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateQuestion}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-aurora-red/10 border border-aurora-red text-aurora-red p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <Textarea
                  placeholder="What's on your mind?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  maxLength={280}
                  rows={4}
                  disabled={creating}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is-public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={creating}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="is-public" className="text-sm text-snow-0 cursor-pointer">
                    Make this question public (visible on trending)
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={creating || !newQuestion.trim()}>
                  {creating ? 'Creating...' : 'Create Question'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Received Answers */}
          {answers.length > 0 && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4 text-snow-2">Received Answers</h2>
              <div className="space-y-4">
                {answers.map((answer) => (
                  <Card key={answer.id} className="animate-fade-in">
                    <CardHeader>
                      <CardDescription className="text-sm">
                        Question: {answer.question.questionText}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-snow-2">{answer.answerText}</p>
                      <p className="text-xs text-snow-1 mt-2">
                        {new Date(answer.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => {
                            setStoryData({
                              type: 'answer',
                              text: answer.question.questionText,
                              answer: answer.answerText,
                            });
                            setStoryModalOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                          </svg>
                          Create Story
                        </Button>
                        <Button
                          onClick={() => {
                            setReportAnswerId(answer.id);
                            setReportModalOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6m3 0V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2m3 0v12c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V6m3 0V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2" />
                          </svg>
                          Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Your Questions */}
          <div>
            <h2 className="text-2xl font-heading font-bold mb-4 text-snow-2">Your Questions</h2>
            {questions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-snow-0">
                  You haven&apos;t created any questions yet. Create your first question above!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id} className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="text-lg">{question.questionText}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {deleteConfirmId === question.id ? (
                        <div className="space-y-4 bg-aurora-red/10 border border-aurora-red p-4 rounded-lg">
                          <p className="text-snow-2 font-medium">Are you sure you want to delete this question?</p>
                          <p className="text-sm text-snow-0">This action cannot be undone. All answers to this question will also be deleted.</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDeleteQuestion(question.id)}
                              disabled={deleting}
                              className="bg-aurora-red hover:bg-aurora-red/90 text-white"
                              size="sm"
                            >
                              {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                            <Button
                              onClick={() => setDeleteConfirmId(null)}
                              disabled={deleting}
                              variant="outline"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex gap-6 text-sm text-snow-0">
                            <span>{question.answerCount} answers</span>
                            <span>{question.viewCount} views</span>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setStoryData({
                                  type: 'question',
                                  text: question.questionText,
                                });
                                setStoryModalOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                              </svg>
                              Share
                            </Button>
                            <Button
                              onClick={() => setDeleteConfirmId(question.id)}
                              variant="outline"
                              size="sm"
                              className="gap-2 text-aurora-red hover:bg-aurora-red/10"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M8 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6m3 0V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2m3 0v12c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V6m3 0V4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2" />
                              </svg>
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Template Modal */}
      <Dialog open={storyModalOpen} onOpenChange={setStoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Story</DialogTitle>
            <DialogClose onClick={() => setStoryModalOpen(false)} />
          </DialogHeader>
          {storyData && (
            <StoryTemplateGenerator
              questionText={storyData.text}
              answerText={storyData.answer}
              username={session?.user?.name}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      {reportAnswerId && (
        <ReportModal
          answerId={reportAnswerId}
          isOpen={reportModalOpen}
          onOpenChange={setReportModalOpen}
          onSuccess={() => {
            // Optionally refresh answers after report
            if (session?.user?.name) {
              fetchUserData(session.user.name);
            }
          }}
        />
      )}
    </div>
  );
}
