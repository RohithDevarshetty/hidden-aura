import { Question, Answer, User, Notification, Template } from './index';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Auth API Types
export interface RegisterRequest {
  username: string;
  email?: string;
}

export interface RegisterResponse {
  userId: string;
  username: string;
  accessCode: string;
  profileUrl: string;
}

export interface LoginCodeRequest {
  accessCode: string;
}

export interface LoginResponse {
  userId: string;
  username: string;
  token: string;
}

export interface GoogleAuthRequest {
  googleToken: string;
}

export interface GoogleAuthResponse extends LoginResponse {
  isNewUser: boolean;
}

// Question API Types
export interface CreateQuestionRequest {
  questionText: string;
  templateId?: string;
  isPublic?: boolean;
}

export interface CreateQuestionResponse {
  questionId: string;
  questionText: string;
  username: string;
  shareUrl: string;
  answerCount: number;
  createdAt: string;
}

export interface QuestionListResponse {
  questions: Question[];
  total: number;
  hasMore: boolean;
}

export interface UpdateQuestionRequest {
  questionText?: string;
  isPublic?: boolean;
}

// Answer API Types
export interface SubmitAnswerRequest {
  answerText: string;
  captchaToken: string;
  deviceFingerprint: string;
}

export interface SubmitAnswerResponse {
  answerId: string;
  message: string;
}

export interface AnswerListResponse {
  answers: Answer[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface UpdateAnswerRequest {
  isRead?: boolean;
  isFavorite?: boolean;
  reactions?: string[];
}

// Profile API Types
export interface ProfileResponse {
  username: string;
  bio?: string;
  totalQuestions: number;
  totalAnswersReceived: number;
  createdAt: string;
  questions: Question[];
}

export interface ProfileViewRequest {
  referrer?: string;
  deviceFingerprint: string;
}

// Explore API Types
export interface TrendingQuestionsResponse {
  questions: TrendingQuestion[];
  total: number;
  hasMore: boolean;
}

export interface TrendingQuestion extends Question {
  trendingScore: number;
}

// Image Generation API Types
export interface GenerateQuestionImageRequest {
  questionId: string;
  templateId: string;
  customization?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
}

export interface GenerateImageResponse {
  imageUrl: string;
  downloadUrl: string;
  expiresAt?: string;
}

export interface GenerateAnswerImageRequest {
  answerId: string;
  templateId: string;
  includeQuestion?: boolean;
}

// Templates API Types
export interface TemplateListResponse {
  templates: Template[];
}

// Notifications API Types
export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface PushSubscriptionRequest {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

// Reports API Types
export interface CreateReportRequest {
  answerId: string;
  reason: string;
  details?: string;
  deviceFingerprint: string;
}

export interface CreateReportResponse {
  reportId: string;
  message: string;
}

// Analytics API Types
export interface AnalyticsOverviewResponse {
  totalQuestions: number;
  totalAnswers: number;
  totalViews: number;
  avgAnswersPerQuestion: number;
  topQuestion?: {
    questionId: string;
    questionText: string;
    answerCount: number;
  };
  answersByDay: Array<{
    date: string;
    count: number;
  }>;
}

// Username check API Types
export interface CheckUsernameResponse {
  available: boolean;
  suggestions: string[];
}
