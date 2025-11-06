

import React, { memo, useState } from 'react';
import { SentenceOption } from '../types';

interface MultipleChoiceChallengeProps {
    options: SentenceOption[];
    correctIndex: number;
    title: string;
    description: string;
    checkButtonText: string;
    continueButtonText: string;
    reviewButtonText: string;
    correctFeedbackText: string;
    incorrectFeedbackText: string;
    wordToHighlight: string;
    onCorrect: () => void;
    onIncorrect: () => void;
    onAttempt: () => void;
}

const OptionButton: React.FC<{
    option: SentenceOption;
    isSelected: boolean;
    isAnswered: boolean;
    isCorrect: boolean;
    onClick: () => void;
    wordToHighlight: string;
}> = ({ option, isSelected, isAnswered, isCorrect, onClick, wordToHighlight }) => {
    const getBackgroundColor = () => {
        if (!isAnswered) {
            return isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700';
        }
        if (isSelected) {
            return isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';
        }
        if (isCorrect) {
            return 'bg-green-100 dark:bg-green-900/50';
        }
        return 'bg-gray-100 dark:bg-zinc-800 opacity-60';
    };

    const getBorderColor = () => {
         if (!isAnswered) {
            return isSelected ? 'border-blue-500' : 'border-transparent';
        }
        if (isSelected) {
            return isCorrect ? 'border-green-500' : 'border-red-500';
        }
         if (isCorrect) {
            return 'border-green-500';
        }
        return 'border-transparent';
    };

    const highlightWord = (text: string, word: string) => {
        if (!word || !text) return text;
        const parts = text.split(new RegExp(`(${word})`, 'gi'));
        return parts.map((part, i) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <strong key={i} className="font-bold text-gray-900 dark:text-zinc-100">
              {part}
            </strong>
          ) : (
            part
          )
        );
    };

    return (
        <button
            onClick={onClick}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${getBackgroundColor()} ${getBorderColor()}`}
        >
            <p className="font-semibold text-gray-800 dark:text-zinc-100">{highlightWord(option.sentence, wordToHighlight)}</p>
            {isAnswered && (
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 animate-fade-in">{option.translation}</p>
            )}
        </button>
    );
};

const MultipleChoiceChallenge: React.FC<MultipleChoiceChallengeProps> = ({
    options,
    correctIndex,
    title,
    description,
    checkButtonText,
    continueButtonText,
    reviewButtonText,
    correctFeedbackText,
    incorrectFeedbackText,
    wordToHighlight,
    onCorrect,
    onIncorrect,
    onAttempt
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    
    const handleSubmit = () => {
        if (selectedIndex === null) return;
        onAttempt();
        setIsAnswered(true);
    };

    const isCorrect = selectedIndex === correctIndex;

    return (
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1 mb-4">{description}</p>
            
            <div className="space-y-3">
                {options.map((option, index) => (
                    <OptionButton
                        key={index}
                        option={option}
                        isSelected={selectedIndex === index}
                        isAnswered={isAnswered}
                        isCorrect={index === correctIndex}
                        onClick={() => setSelectedIndex(index)}
                        wordToHighlight={wordToHighlight}
                    />
                ))}
            </div>

            {!isAnswered ? (
                 <button
                    onClick={handleSubmit}
                    disabled={selectedIndex === null}
                    className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {checkButtonText}
                </button>
            ) : (
                <div className={`mt-6 p-4 rounded-xl text-center animate-fade-in ${isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                        {isCorrect ? correctFeedbackText : incorrectFeedbackText}
                    </h3>
                    
                    {isCorrect ? (
                        <button
                            onClick={onCorrect}
                            className="mt-3 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-transform hover:scale-105"
                        >
                            {continueButtonText}
                        </button>
                    ) : (
                         <button
                            onClick={onIncorrect}
                            className="mt-3 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-transform hover:scale-105"
                        >
                            {reviewButtonText}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(MultipleChoiceChallenge);
