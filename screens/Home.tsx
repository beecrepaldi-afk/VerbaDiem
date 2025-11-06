import React, { memo } from 'react';
import { UserData } from '../types';
import { LEVELS } from '../constants';
import Icon from '../components/Icon';
import OnboardingGuide from '../components/OnboardingGuide';

interface HomeProps {
    onStartLesson: () => void;
    onGoToSettings: () => void;
    onGoToStatistics: () => void;
    onGoToMemoryChest: () => void;
    content: any;
    userData: UserData;
    showOnboarding: boolean;
    onOnboardingComplete: () => void;
}

const MenuItem: React.FC<{ id?: string; icon: 'settings' | 'chart' | 'chest'; title: string; subtitle: string; onClick: () => void; disabled?: boolean }> = ({ id, icon, title, subtitle, onClick, disabled = false }) => (
    <button id={id} onClick={onClick} disabled={disabled} className="flex items-center text-left p-4 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-xl flex-1 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-zinc-900 active:bg-gray-200/80 dark:active:bg-zinc-800/80">
        <div className="p-2.5 bg-gray-200 dark:bg-zinc-800 rounded-lg mr-4">
            <Icon name={icon} className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
        </div>
        <div>
            <p className="font-semibold text-gray-700 dark:text-zinc-300">{title}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">{subtitle}</p>
        </div>
    </button>
);

const Home: React.FC<HomeProps> = ({ onStartLesson, onGoToSettings, onGoToStatistics, onGoToMemoryChest, content, userData, showOnboarding, onOnboardingComplete }) => {
    const { streak, learnedWords, xp, level } = userData;
    const learnedWordsCount = Object.keys(learnedWords).length;

    const currentLevel = LEVELS[level - 1];
    const nextLevel = LEVELS[level];
    const progressPercentage = nextLevel 
        ? Math.max(0, Math.min(100, ((xp - currentLevel.xpThreshold) / (nextLevel.xpThreshold - currentLevel.xpThreshold)) * 100))
        : 100;

    const onboardingSteps = [
        { targetId: 'todays-word-btn', text: content.onboarding_step_1, position: 'bottom' as const },
        { targetId: 'streak-counter', text: content.onboarding_step_2, position: 'bottom' as const },
        { targetId: 'memory-chest-btn', text: content.onboarding_step_3, position: 'bottom' as const },
    ];

    return (
        <div className="space-y-6">
            {showOnboarding && <OnboardingGuide steps={onboardingSteps} onComplete={onOnboardingComplete} content={content} />}
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{content.home_greeting}</h1>
                <p className="text-md text-gray-600 dark:text-zinc-400 mt-1">{content.home_description}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-md border border-black/5 dark:border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-blue-500 dark:text-blue-400">{content.home_level} {level} - {content[currentLevel.nameKey]}</span>
                    {nextLevel && <span className="text-gray-500 dark:text-zinc-400">{xp} / {nextLevel.xpThreshold} XP</span>}
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {streak && streak.count > 0 && (
                 <div id="streak-counter" className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-4 shadow-md border border-black/5 dark:border-white/10 flex items-center justify-center gap-4 text-center">
                    <Icon name="flame" className="w-8 h-8 text-amber-500 animate-pulse-flame" />
                    <div>
                        <p className="text-3xl font-bold text-amber-500">
                           <span key={streak.count} className="inline-block animate-count-up">{streak.count}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">{content.home_streak_title}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <button
                    id="todays-word-btn"
                    onClick={onStartLesson}
                    className="w-full bg-blue-500 text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <Icon name="book" className="w-5 h-5" />
                    <span>{content.home_start_learning}</span>
                </button>

                <MenuItem id="memory-chest-btn" icon="chest" title={content.home_memory_chest_title} subtitle={content.home_memory_chest_desc} onClick={onGoToMemoryChest} disabled={learnedWordsCount === 0} />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <MenuItem icon="settings" title={content.home_settings} subtitle={content.home_settings_desc} onClick={onGoToSettings} />
                <MenuItem icon="chart" title={content.home_statistics} subtitle={content.home_statistics_desc} onClick={onGoToStatistics} />
            </div>
        </div>
    );
};

export default memo(Home);