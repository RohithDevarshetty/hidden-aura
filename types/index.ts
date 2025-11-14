export interface User {
  id: string;
  username: string;
  email?: string | null;
  emailVerified: boolean;
  googleId?: string | null;
  profilePictureUrl?: string | null;
  bio?: string | null;
  notificationPreferences: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  isActive: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface Question {
  id: string;
  userId: string;
  username: string;
  questionText: string;
  templateId?: string | null;
  isPublic: boolean;
  answerCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Answer {
  id: string;
  questionId: string;
  answerText: string;
  deviceFingerprintHash: string;
  ipAddressHash: string;
  isRead: boolean;
  isFavorite: boolean;
  reactions: string[];
  createdAt: Date;
  flaggedAt?: Date | null;
  flagReason?: string | null;
}

export interface Template {
  id: string;
  name: string;
  description?: string | null;
  previewImageUrl?: string | null;
  cssConfig: TemplateCSSConfig;
  isPremium: boolean;
  displayOrder: number;
  createdAt: Date;
}

export interface TemplateCSSConfig {
  background: string;
  textColor: string;
  fontFamily: string;
  fontSize?: string;
  padding?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string | null;
  answerId?: string | null;
  questionId?: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  answerId: string;
  reason: string;
  details?: string | null;
  reportedByDeviceHash?: string | null;
  status: string;
  createdAt: Date;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
}

export interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

export interface AnswerWithQuestion extends Answer {
  question: Question;
}

export type SessionUser = {
  id: string;
  username: string;
  email?: string | null;
};
