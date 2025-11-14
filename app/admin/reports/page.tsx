'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Report {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  answer: {
    id: string;
    answerText: string;
    question: {
      questionText: string;
    };
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'action_taken'>('pending');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?status=${filter}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setReports(data.data.reports || []);
        setTotal(data.data.total || 0);
      } else {
        setError(data.error?.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (err) {
      console.error('Failed to update report:', err);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      pending: 'bg-aurora-yellow/20 text-aurora-yellow',
      reviewed: 'bg-frost-1/20 text-frost-1',
      dismissed: 'bg-snow-0/20 text-snow-0',
      action_taken: 'bg-aurora-green/20 text-aurora-green',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-nord-0">
      {/* Navigation */}
      <nav className="border-b border-nord-2 bg-nord-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-heading font-bold text-frost-1">
            HiddenAura
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-snow-2 mb-2">Moderation Reports</h1>
            <p className="text-snow-0">Review and manage community reports</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['pending', 'reviewed', 'dismissed', 'action_taken'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-frost-1 text-nord-0'
                    : 'bg-nord-2/40 text-snow-2 hover:bg-nord-2/60'
                }`}
              >
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)} ({total})
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-aurora-red/10 border border-aurora-red text-aurora-red p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-frost-1 border-r-transparent" />
            </div>
          )}

          {/* Reports List */}
          {!loading && reports.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-snow-0">
                No reports found in this category
              </CardContent>
            </Card>
          )}

          {!loading && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="border border-nord-2/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{report.reason.toUpperCase()}</CardTitle>
                          <StatusBadge status={report.status} />
                        </div>
                        <CardDescription className="text-base">
                          Question: {report.answer.question.questionText}
                        </CardDescription>
                      </div>
                      <div className="text-xs text-snow-0">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Answer Being Reported */}
                    <div className="bg-nord-2/20 p-4 rounded-lg border border-nord-2/30">
                      <p className="text-xs font-medium text-snow-0 mb-2">Reported Answer:</p>
                      <p className="text-snow-2">{report.answer.answerText}</p>
                    </div>

                    {/* Report Details */}
                    {report.details && (
                      <div className="bg-nord-2/10 p-4 rounded-lg border border-nord-2/30">
                        <p className="text-xs font-medium text-snow-0 mb-2">Report Details:</p>
                        <p className="text-snow-2">{report.details}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {report.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateReportStatus(report.id, 'reviewed')}
                            variant="outline"
                            size="sm"
                          >
                            Mark Reviewed
                          </Button>
                          <Button
                            onClick={() => updateReportStatus(report.id, 'action_taken')}
                            size="sm"
                            className="bg-aurora-red hover:bg-aurora-red/90"
                          >
                            Take Action
                          </Button>
                          <Button
                            onClick={() => updateReportStatus(report.id, 'dismissed')}
                            variant="outline"
                            size="sm"
                          >
                            Dismiss
                          </Button>
                        </>
                      )}
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
