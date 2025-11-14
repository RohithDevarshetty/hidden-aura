import { z } from 'zod';
import {
  MAX_QUESTION_LENGTH,
  MAX_ANSWER_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from './constants';

export const usernameSchema = z
  .string()
  .min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`)
  .max(MAX_USERNAME_LENGTH, `Username must be at most ${MAX_USERNAME_LENGTH} characters`)
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const emailSchema = z.string().email('Invalid email address').optional();

export const questionSchema = z.object({
  questionText: z
    .string()
    .min(1, 'Question cannot be empty')
    .max(MAX_QUESTION_LENGTH, `Question must be at most ${MAX_QUESTION_LENGTH} characters`),
  templateId: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const answerSchema = z.object({
  answerText: z
    .string()
    .min(1, 'Answer cannot be empty')
    .max(MAX_ANSWER_LENGTH, `Answer must be at most ${MAX_ANSWER_LENGTH} characters`),
  captchaToken: z.string().optional(),
  deviceFingerprint: z.string().optional(),
});

export const accessCodeSchema = z
  .string()
  .length(6, 'Access code must be 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Invalid access code format');

export const reportSchema = z.object({
  answerId: z.string().uuid('Invalid answer ID'),
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'off-topic', 'other']),
  details: z.string().optional(),
  deviceFingerprint: z.string().min(1, 'Device fingerprint required'),
});
