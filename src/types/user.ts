export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  subscription?: 'free' | 'premium';
  authProvider?: 'email' | 'google';
}

export interface EssayHistory {
  id: string;
  title: string;
  content: string;
  analysis: EssayAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  totalEssays: number;
  averageScore: number;
  improvementRate: number;
  strengths: string[];
  areasForImprovement: string[];
  weeklyProgress: {
    week: string;
    score: number;
    essayCount: number;
  }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

import { EssayAnalysis } from './essay';
