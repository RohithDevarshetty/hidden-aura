'use client';

import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';

interface StoryTemplateProps {
  questionText: string;
  answerText?: string;
  username?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  cssConfig: {
    bgGradient: string;
    text: string;
    accent: string;
    fontSize: number;
    style: string;
    hasGrid?: boolean;
  };
  isPremium: boolean;
}

export function StoryTemplateGenerator({ questionText, answerText, username }: StoryTemplateProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const FIXED_FONT_SIZE = 26;
  const FIXED_QR_SIZE = 60;

  const profileLink = username ? `${typeof window !== 'undefined' ? window.location.origin : ''}/@${username}` : '';

  // Default glassmorphic style
  const defaultStyle = {
    bgGradient: 'linear-gradient(135deg, rgba(136, 192, 208, 0.3) 0%, rgba(163, 230, 53, 0.3) 100%)',
    text: '#ECEFF4',
    accent: '#8BC0D0',
    fontSize: 26,
    style: 'glassmorphic',
  };

  // Generate QR code when needed
  useEffect(() => {
    if (showQR && profileLink) {
      QRCode.toDataURL(profileLink, {
        width: FIXED_QR_SIZE,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation failed:', err));
    }
  }, [profileLink, showQR]);

  const copyProfileLink = async () => {
    if (!username) return;
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const styles = defaultStyle;

  const downloadImage = async () => {
    if (!canvasRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `hidden-aura-${Date.now()}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplate = () => {
    if (styles.style === 'neon' && styles.hasGrid) {
      return (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      );
    }
    return <></>;
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Preview Canvas - Minimized while maintaining 9:16 aspect ratio */}
      <div
        ref={canvasRef}
        className="w-40 aspect-[9/16] p-4 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-lg"
        style={{ background: styles.bgGradient }}
      >
        {renderTemplate()}

        <div className="relative z-10 space-y-1">
          {/* Question */}
          <div>
            <p
              className="font-bold leading-tight"
              style={{
                color: styles.text,
                fontSize: '8px',
              }}
            >
              {questionText}
            </p>
          </div>

          {/* Answer */}
          {answerText && (
            <div className="border-t-[0.5px] pt-1" style={{ borderColor: styles.accent }}>
              <p
                className="leading-tight"
                style={{
                  color: styles.text,
                  fontSize: '6px',
                  opacity: 0.9,
                }}
              >
                {answerText}
              </p>
            </div>
          )}

          {/* Username */}
          {username && (
            <div
              className="mt-auto pt-1"
              style={{
                color: styles.text,
                fontSize: '5px',
                opacity: 0.7,
              }}
            >
              @{username}
            </div>
          )}
        </div>

        {/* HiddenAura branding - Left Bottom */}
        <div
          className="absolute bottom-1 left-1 font-semibold"
          style={{ color: styles.accent, fontSize: '4px' }}
        >
          HiddenAura
        </div>

        {/* QR Code - Right Bottom */}
        {showQR && qrDataUrl && (
          <div
            className="absolute bottom-1 right-1 flex flex-col items-center gap-0.5 p-1 rounded"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <img
              src={qrDataUrl}
              alt="QR Code"
              width={20}
              height={20}
              style={{ imageRendering: 'crisp-edges', backgroundColor: '#FFFFFF' }}
            />
          </div>
        )}
      </div>

      {/* QR Code Toggle and Buttons */}
      <div className="space-y-3">
        {/* QR Code Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="qr-toggle"
            checked={showQR}
            onChange={(e) => setShowQR(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="qr-toggle" className="text-xs font-medium text-snow-2 cursor-pointer">
            Show QR Code
          </label>
        </div>

        {/* Download and Copy Profile Buttons - Side by Side */}
        <div className="flex gap-3">
          <Button
            onClick={downloadImage}
            disabled={isDownloading}
            className="flex-1"
            size="lg"
          >
            {isDownloading ? 'Generating...' : 'Download'}
          </Button>

          {username && (
            <Button
              onClick={copyProfileLink}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {copied ? '✓ Copied' : 'Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
