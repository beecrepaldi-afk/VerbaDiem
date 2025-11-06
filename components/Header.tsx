import React, { memo } from 'react';
import Icon from './Icon';
import { StreakData } from '../types';

interface HeaderProps {
  titlePart1: string;
  titlePart2: string;
  showBack?: boolean;
  onBack?: () => void;
  streakData?: StreakData;
}

const Header: React.FC<HeaderProps> = ({ titlePart1, titlePart2, showBack = false, onBack, streakData }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                {showBack && (
                    <button onClick={onBack} className="p-2 -m-2 mr-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors active:bg-gray-200 dark:active:bg-zinc-700">
                         <Icon name="back" className="w-6 h-6" />
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {titlePart1}<span className="font-light">{titlePart2}</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {streakData && streakData.count > 0 && (
                     <div key={streakData.count} className="flex items-center gap-1.5 text-amber-500 font-bold animate-pop-in">
                        <Icon name="flame" className="w-5 h-5" />
                        <span>{streakData.count}</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);