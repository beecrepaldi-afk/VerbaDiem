import React, { memo } from 'react';
import { DailyWord } from '../types';
import Icon from './Icon';

interface WordCardProps {
  wordData: DailyWord;
  etymologyTitle: string;
  exampleTitle: string;
  onPlayAudio: () => void;
  isAudioPlaying: boolean;
}

const InfoBlock: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactElement }> = ({ title, children, icon }) => (
    <div className="mt-6">
        <div className="flex items-center justify-center mb-2">
            {icon}
            <h3 className="text-md font-semibold text-gray-700 dark:text-zinc-300 ml-2.5">{title}</h3>
        </div>
        <div className="text-center text-gray-600 dark:text-zinc-400 text-base leading-relaxed">
            {children}
        </div>
    </div>
);

const WordCard: React.FC<WordCardProps> = ({ wordData, etymologyTitle, exampleTitle, onPlayAudio, isAudioPlaying }) => {
  const highlightWord = (text: string, word: string) => {
    if (!word || !text) return text;
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <strong key={i} className="font-semibold text-gray-900 dark:text-zinc-100 not-italic">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-500 tracking-tight">{wordData.word}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-gray-500 dark:text-zinc-400">{wordData.pronunciation}</p>
            <button 
                onClick={onPlayAudio} 
                disabled={isAudioPlaying}
                className="p-2 -m-2 rounded-full text-gray-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label="Play pronunciation"
            >
                {isAudioPlaying ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <Icon name="speaker" className="w-5 h-5" />
                )}
            </button>
        </div>
        <p className="text-xl font-semibold text-gray-800 dark:text-zinc-200 mt-2">{wordData.translation}</p>
      </div>

      <hr className="border-gray-200 dark:border-zinc-800" />

      <div className="pt-2">
        <InfoBlock 
            title={etymologyTitle}
            icon={<Icon name="book" className="w-5 h-5 stroke-blue-500" />}
        >
            <p className="hyphenate text-justify">{wordData.etymology}</p>
        </InfoBlock>

        <InfoBlock 
            title={exampleTitle}
            icon={<Icon name="chat" className="w-5 h-5 stroke-blue-500" />}
        >
             <div>
                <p className="italic text-gray-700 dark:text-zinc-300">"{highlightWord(wordData.example, wordData.word)}"</p>
                <p className="text-gray-500 dark:text-zinc-500 text-xs mt-1">- {wordData.exampleTranslation}</p>
            </div>
        </InfoBlock>
      </div>
    </div>
  );
};

export default memo(WordCard);