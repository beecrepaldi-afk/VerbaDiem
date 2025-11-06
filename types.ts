

import React from 'react';


export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  MANDARIN = 'zh',
}

export enum View {
  WELCOME,
  HOME,
  LEARNING,
  SETTINGS,
  STATISTICS,
  LESSON_COMPLETE,
  REVIEW,
  PRACTICE,
  MEMORY_CHEST,
}

export interface DailyWord {
  word: string;
  pronunciation: string;
  translation: string;
  etymology: string;
  example: string;
  exampleTranslation: string;
}

export interface RelatedWord {
  word: string;
  translation: string;
  reason: string;
}

export interface SentenceOption {
  sentence: string;
  translation: string;
}

export interface SentenceChallenge {
  options: SentenceOption[];
  correctIndex: number;
}

export interface Evaluation {
  isValid: boolean;
  rating: number;
  feedback: string;
}

export interface StreakData {
  count: number;
  lastCompletionDate: string; // ISO date string: YYYY-MM-DD
}

// --- NEW ---
export interface Collection {
    id: string;
    name: string;
    wordIds: string[];
}

// Gamification Types
export interface Level {
  level: number;
  nameKey: string;
  xpThreshold: number;
}

export type AchievementId = 'STREAK_7' | 'LEARNED_1' | 'LEARNED_25' | 'REVIEW_10' | 'RELATED_10' | 'PERFECT_LESSON' | 'PRACTICE_1' | 'VISUALIZE_5';

export interface Achievement {
  id: AchievementId;
  nameKey: string;
  descriptionKey: string;
  icon: 'flame' | 'book' | 'chest' | 'trophy' | 'chat' | 'sparkles' | 'folder';
  condition: (data: UserData) => boolean;
}

export interface UserData {
  streak: StreakData;
  longestStreak: number;
  learnedWords: { [wordId: string]: DailyWord }; // Changed from array to object
  collections: Collection[];
  xp: number;
  level: number;
  unlockedAchievements: AchievementId[];
  practiceCount: number;
  visualizeCount: number;
  reviewCount: number;
  relatedWordCount: number;
  lessonsCompletedSinceAd: number;
}

export interface Notification {
  id: number;
  type: 'xp' | 'level' | 'achievement';
  message: string;
  icon?: React.ReactNode;
}