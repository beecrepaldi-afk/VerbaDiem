

import React, { useState, useMemo, memo } from 'react';
import { DailyWord } from '../types';
import Icon from '../components/Icon';

interface ReviewProps {
    reviewWords: DailyWord[];
    content: any;
    onFinish: () => void;
}

const Review: React.FC<ReviewProps> = ({ reviewWords, content, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentWord = useMemo(() => reviewWords[currentIndex], [reviewWords, currentIndex]);

    const handleCheckAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || !currentWord) return;
        
        const correct = userAnswer.trim().toLowerCase() === currentWord.word.toLowerCase();
        setIsCorrect(correct);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentIndex < reviewWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setIsAnswered(false);
            setIsCorrect(null);
        } else {
            // Mark as complete to show completion screen
            setCurrentIndex(prev => prev + 1);
        }
    };

    const renderChallenge = () => {
        if (!currentWord) return null;
        
        const parts = currentWord.example.split(new RegExp(`(${currentWord.word})`, 'gi'));
        const sentenceWithBlank = parts.map((part, i) =>
            part.toLowerCase() === currentWord.word.toLowerCase() ? (
                <span key={i} className="font-semibold text-gray-700 dark:text-zinc-300 border-b-2 border-dashed border-gray-400 dark:border-zinc-600 px-2 mx-1">
                    {''.padStart(part.length, '_')}
                </span>
            ) : (
                part
            )
        );

        return (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 w-full">
                <p className="text-center text-sm font-medium text-gray-500 dark:text-zinc-400 mb-4">{`(${currentIndex + 1}/${reviewWords.length})`}</p>
                <div className="text-center">
                    <p className="text-lg text-gray-800 dark:text-zinc-200 leading-relaxed">"{sentenceWithBlank}"</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">- {currentWord.exampleTranslation}</p>
                </div>

                <form onSubmit={handleCheckAnswer} className="mt-6">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={content.review_placeholder}
                        className="w-full p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 dark:text-zinc-100 text-center font-semibold tracking-wider"
                        disabled={isAnswered}
                        autoFocus
                    />
                     <button
                        type="submit"
                        disabled={isAnswered || !userAnswer.trim()}
                        className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {content.review_submit_button}
                    </button>
                </form>

                {isAnswered && (
                    <div className="mt-6 text-center animate-fade-in">
                        {isCorrect ? (
                             <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/50">
                                <h3 className="text-lg font-bold text-green-700 dark:text-green-300">{content.review_correct_feedback}</h3>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/50">
                                <p className="text-sm text-gray-600 dark:text-zinc-400">{content.review_incorrect_feedback}</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">{currentWord.word}</p>
                            </div>
                        )}
                        <button
                            onClick={handleNext}
                            className="mt-4 w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-gray-800"
                        >
                            {currentIndex < reviewWords.length - 1 ? content.review_next_button : content.review_finish_button}
                        </button>
                    </div>
                )}
            </div>
        );
    };
    
    const renderCompletionScreen = () => (
        <div className="text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                 <Icon name="chest" className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{content.review_all_done_title}</h1>
            <p className="text-md text-gray-600 dark:text-zinc-400">{content.review_all_done_description}</p>
            <button onClick={onFinish} className="w-full max-w-xs mx-auto bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-transform hover:scale-105">
                {content.lesson_complete_back_home_button}
            </button>
        </div>
    );
    
    if (reviewWords.length === 0) {
        return (
            <div className="text-center space-y-4 animate-fade-in">
                 <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                     <Icon name="chest" className="w-12 h-12 text-gray-500 dark:text-zinc-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{content.review_no_words_title}</h1>
                <p className="text-md text-gray-600 dark:text-zinc-400">{content.review_no_words_description}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">{content.review_title}</h1>
             <p className="text-center text-md text-gray-600 dark:text-zinc-400 -mt-6">{content.review_description}</p>
            {currentIndex < reviewWords.length ? renderChallenge() : renderCompletionScreen()}
        </div>
    );
};

export default memo(Review);
