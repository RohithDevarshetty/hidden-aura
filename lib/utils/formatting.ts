import { formatDistanceToNow } from 'date-fns';

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export function formatCount(count: number): string {
  if (count === 0) {
    return 'No';
  }
  if (count === 1) {
    return '1';
  }
  if (count < 1000) {
    return count.toString();
  }
  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${Math.floor(count / 1000)}k`;
}

export function getProfileUrl(username: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/@${username}`;
}

export function getQuestionUrl(username: string, questionId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/@${username}/q/${questionId}`;
}
