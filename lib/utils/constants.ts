export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'AnonAsk';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const MAX_QUESTION_LENGTH = 280;
export const MAX_ANSWER_LENGTH = 500;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 3;

export const QUESTION_TEMPLATES = [
  'Ask me anything',
  'Send me song recommendations',
  'Rate my outfit 1-10',
  'Assumptions about me?',
  'Would you rather with me...',
  'Compliment me anonymously',
  'What should I know about myself?',
  'Send me a pickup line',
  'Hot take? Give me yours',
  'Recommend me a movie/book/show',
];

export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'off-topic', label: 'Off-topic' },
  { value: 'other', label: 'Other' },
];

export const NOTIFICATION_TYPES = {
  NEW_ANSWER: 'new_answer',
  TRENDING: 'trending',
  MILESTONE: 'milestone',
};
