import React, { memo } from 'react';
import { UserData, AchievementId } from '../types';
import { ACHIEVEMENTS } from '../constants';
import Icon from '../components/Icon';

interface StatisticsProps {
    userData: UserData;
    content: any;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: React.ReactNode; label: string }> = ({ icon, value, label }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl flex items-center gap-5 border border-black/5 dark:border-white/10 shadow-md">
        {icon}
        <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-base text-gray-500 dark:text-zinc-400 font-medium">{label}</p>
        </div>
    </div>
);

const AchievementCard: React.FC<{ achievement: typeof ACHIEVEMENTS[0]; isUnlocked: boolean; content: any }> = ({ achievement, isUnlocked, content }) => {
    const iconColor = isUnlocked ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-600';
    
    return (
        <div className={`bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-4 border border-black/5 dark:border-white/10 shadow-md transition-opacity ${!isUnlocked && 'opacity-60'}`}>
            <div className={`p-3 rounded-full ${isUnlocked ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-gray-100 dark:bg-zinc-800'}`}>
                <Icon name={achievement.icon} className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
                 <p className="font-bold text-gray-800 dark:text-zinc-200">{content[achievement.nameKey]}</p>
                 <p className="text-sm text-gray-500 dark:text-zinc-400">{content[achievement.descriptionKey]}</p>
            </div>
        </div>
    );
};


const Statistics: React.FC<StatisticsProps> = ({ userData, content }) => {
    const { streak, longestStreak, learnedWords, unlockedAchievements } = userData;

    return (
        <div className="space-y-8 animate-fade-in">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">{content.stats_title}</h1>
            <div className="grid grid-cols-1 gap-4">
                <StatCard 
                    icon={<Icon name="flame" className="w-10 h-10 text-amber-500" />}
                    value={streak.count}
                    label={content.stats_current_streak}
                />
                <StatCard 
                    icon={<Icon name="trophy" className="w-10 h-10 text-blue-500" />}
                    value={longestStreak}
                    label={content.stats_longest_streak}
                />
                <StatCard 
                    icon={<Icon name="book" className="w-10 h-10 text-green-500" />}
                    value={Object.keys(learnedWords).length}
                    label={content.stats_words_learned}
                />
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">{content.stats_achievements}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map(ach => (
                        <AchievementCard 
                            key={ach.id}
                            achievement={ach}
                            isUnlocked={unlockedAchievements.includes(ach.id)}
                            content={content}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(Statistics);