'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ReportModalProps {
  answerId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ReportReason = 'spam' | 'abuse' | 'offensive' | 'harassment' | 'misinformation' | 'other';

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: 'spam', label: 'Spam', description: 'Irrelevant or promotional content' },
  { value: 'abuse', label: 'Abusive Content', description: 'Hateful or threatening language' },
  { value: 'offensive', label: 'Offensive', description: 'Offensive or inappropriate content' },
  { value: 'harassment', label: 'Harassment', description: 'Targeted harassment or bullying' },
  { value: 'misinformation', label: 'Misinformation', description: 'False or misleading information' },
  { value: 'other', label: 'Other', description: 'Something else' },
];

export function ReportModal({ answerId, isOpen, onOpenChange, onSuccess }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerId,
          reason: selectedReason,
          details: details || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit report');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSelectedReason(null);
        setDetails('');
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) {
        setSelectedReason(null);
        setDetails('');
        setError('');
        setSubmitted(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => handleOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Report Answer</DialogTitle>
          <p className="text-sm text-snow-0 mt-2">Help us keep the community safe and respectful</p>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-aurora-green/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <h3 className="font-semibold text-snow-2">Thank you!</h3>
            <p className="text-sm text-snow-0">Your report has been submitted. Our team will review it shortly.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reason Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-snow-2 block">Why are you reporting this?</label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    onClick={() => setSelectedReason(reason.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedReason === reason.value
                        ? 'border-frost-1 bg-frost-1/10'
                        : 'border-nord-2/30 bg-nord-2/10 hover:border-nord-2/50'
                    }`}
                  >
                    <div className="font-medium text-sm text-snow-2">{reason.label}</div>
                    <div className="text-xs text-snow-0 mt-1">{reason.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-snow-2 block">Additional details (optional)</label>
              <Textarea
                placeholder="Provide more context about why you're reporting this..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={500}
                rows={3}
                disabled={isSubmitting}
              />
              <p className="text-xs text-snow-0">{details.length}/500</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-aurora-red/10 border border-aurora-red text-aurora-red p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
                className="bg-aurora-red hover:bg-aurora-red/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
