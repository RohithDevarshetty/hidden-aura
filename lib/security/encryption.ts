import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hash a string using bcrypt
 */
export async function hashString(value: string): Promise<string> {
  return bcrypt.hash(value, SALT_ROUNDS);
}

/**
 * Verify a string against a bcrypt hash
 */
export async function verifyHash(value: string, hash: string): Promise<boolean> {
  return bcrypt.compare(value, hash);
}

/**
 * Generate a secure random access code (6 characters, alphanumeric uppercase)
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
  let code = '';
  const randomBytes = crypto.randomBytes(6);

  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }

  return code;
}

/**
 * Hash IP address or device fingerprint for privacy
 */
export function hashIdentifier(identifier: string): string {
  return crypto
    .createHash('sha256')
    .update(identifier + (process.env.NEXTAUTH_SECRET || 'fallback-secret'))
    .digest('hex');
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate username format
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: 'Username must be between 3 and 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize text input (remove potential XSS)
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
