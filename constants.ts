

import { Language, Level, Achievement, UserData } from './types';

// For Gemini prompts, needs language name in English
export const LanguageEnglishNames: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.SPANISH]: 'Spanish',
    [Language.FRENCH]: 'French',
    [Language.GERMAN]: 'German',
    [Language.PORTUGUESE]: 'Portuguese',
    [Language.RUSSIAN]: 'Russian',
    [Language.MANDARIN]: 'Mandarin Chinese',
};

// For UI display, shows the native name of the language
export const LanguageNativeNames: Record<Language, string> = {
    [Language.ENGLISH]: 'English',
    [Language.SPANISH]: 'Español',
    [Language.FRENCH]: 'Français',
    [Language.GERMAN]: 'Deutsch',
    [Language.PORTUGUESE]: 'Português',
    [Language.RUSSIAN]: 'Русский',
    [Language.MANDARIN]: '中文',
};

// --- GAMIFICATION CONSTANTS ---

export const AD_FREQUENCY = 3; // Show an ad every 3 lessons

export const XP_REWARDS = {
    LESSON_COMPLETE: 20,
    PERFECT_QUIZ: 10,
    REVIEW_SESSION: 30,
    RELATED_WORD: 5,
    PRACTICE_SESSION: 15,
    VISUALIZE_WORD: 10,
};

export const LEVELS: Level[] = [
    { level: 1, nameKey: "level_1_name", xpThreshold: 0 },
    { level: 2, nameKey: "level_2_name", xpThreshold: 200 },
    { level: 3, nameKey: "level_3_name", xpThreshold: 500 },
    { level: 4, nameKey: "level_4_name", xpThreshold: 1000 },
    { level: 5, nameKey: "level_5_name", xpThreshold: 2000 },
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'LEARNED_1',
        nameKey: 'achievement_learned_1_name',
        descriptionKey: 'achievement_learned_1_desc',
        icon: 'book',
        condition: (data: UserData) => Object.keys(data.learnedWords).length >= 1,
    },
    {
        id: 'STREAK_7',
        nameKey: 'achievement_streak_7_name',
        descriptionKey: 'achievement_streak_7_desc',
        icon: 'flame',
        condition: (data: UserData) => data.streak.count >= 7,
    },
    {
        id: 'PERFECT_LESSON',
        nameKey: 'achievement_perfect_lesson_name',
        descriptionKey: 'achievement_perfect_lesson_desc',
        icon: 'trophy',
        condition: () => false, // This is awarded manually
    },
     {
        id: 'PRACTICE_1',
        nameKey: 'achievement_practice_1_name',
        descriptionKey: 'achievement_practice_1_desc',
        icon: 'chat',
        condition: (data: UserData) => (data.practiceCount || 0) >= 1,
    },
    {
        id: 'LEARNED_25',
        nameKey: 'achievement_learned_25_name',
        descriptionKey: 'achievement_learned_25_desc',
        icon: 'book',
        condition: (data: UserData) => Object.keys(data.learnedWords).length >= 25,
    },
    {
        id: 'VISUALIZE_5',
        nameKey: 'achievement_visualize_5_name',
        descriptionKey: 'achievement_visualize_5_desc',
        icon: 'sparkles',
        condition: (data: UserData) => (data.visualizeCount || 0) >= 5,
    },
    {
        id: 'REVIEW_10',
        nameKey: 'achievement_review_10_name',
        descriptionKey: 'achievement_review_10_desc',
        icon: 'chest',
        condition: (data: UserData) => (data.reviewCount || 0) >= 10,
    },
    {
        id: 'RELATED_10',
        nameKey: 'achievement_related_10_name',
        descriptionKey: 'achievement_related_10_desc',
        icon: 'trophy',
        condition: (data: UserData) => (data.relatedWordCount || 0) >= 10,
    }
];