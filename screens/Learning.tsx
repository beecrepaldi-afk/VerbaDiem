import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { DailyWord, Language, SentenceChallenge, Notification } from '../types';
import { fetchDailyWordOnline, getSentenceChallenge } from '../services/geminiService';
import { triggerHaptic } from '../utils/haptics';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { offlineDeck } from '../offline-deck';
import WordCard from '../components/WordCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MultipleChoiceChallenge from '../components/MultipleChoiceChallenge';
import Icon from '../components/Icon';

interface LearningProps {
    nativeLanguage: Language;
    targetLanguage: Language;
    content: any;
    onLessonComplete: (word: DailyWord, isFirstTry: boolean) => void;
    learnedWords: string[];
    onShowNotification: (notif: Omit<Notification, 'id'>) => void;
}

const Learning: React.FC<LearningProps> = ({ nativeLanguage, targetLanguage, content, onLessonComplete, learnedWords, onShowNotification }) => {
    const [dailyWord, setDailyWord] = useState<DailyWord | null>(null);
    const [sentenceChallenge, setSentenceChallenge] = useState<SentenceChallenge | null>(null);
    const [learningStep, setLearningStep] = useState<'WORD' | 'CHALLENGE'>('WORD');
    const [isLoadingWord, setIsLoadingWord] = useState<boolean>(true);
    const [isLoadingChallenge, setIsLoadingChallenge] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const quizAttemptsRef = useRef(0);
    
    const { play, isPlaying, cleanup } = useAudioPlayer();

    useEffect(() => {
        const controller = new AbortController();

        const fetchWord = async () => {
            setIsLoadingWord(true);
            setDailyWord(null);
            setError(null);
            setSentenceChallenge(null);
            setLearningStep('WORD');
            quizAttemptsRef.current = 0;
            try {
                const wordData = await fetchDailyWordOnline(targetLanguage, nativeLanguage, learnedWords);
                if (!controller.signal.aborted) {
                    setDailyWord(wordData);
                }
            } catch (err) {
                 if (!controller.signal.aborted) {
                    console.warn("Online fetch failed, attempting to use offline deck.", err);
                    
                    const availableOfflineWords = offlineDeck.filter(
                        word => !learnedWords.includes(word.word)
                    );

                    if (availableOfflineWords.length > 0) {
                        const offlineWord = availableOfflineWords[Math.floor(Math.random() * availableOfflineWords.length)];
                        setDailyWord(offlineWord);
                        onShowNotification({ type: 'achievement', message: content.notification_offline_deck_word, icon: <Icon name="wifi-slash" className="w-5 h-5" /> });
                    } else {
                        setError(content.error_fetch_word);
                    }
                }
            } finally {
                 if (!controller.signal.aborted) {
                    setIsLoadingWord(false);
                }
            }
        };

        fetchWord();

        return () => {
            controller.abort();
            cleanup();
        };
    }, [targetLanguage, nativeLanguage, content, learnedWords, onShowNotification, cleanup]);

    useEffect(() => {
        if (!dailyWord) return;

        const controller = new AbortController();
        const fetchChallenge = async () => {
            setIsLoadingChallenge(true);
            setSentenceChallenge(null);
            try {
                const challengeData = await getSentenceChallenge(dailyWord, targetLanguage, nativeLanguage);
                if (!controller.signal.aborted) {
                    // Randomize the order of challenge options
                    const options = [...challengeData.options];
                    const correctOption = options[challengeData.correctIndex];

                    // Fisher-Yates shuffle
                    for (let i = options.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [options[i], options[j]] = [options[j], options[i]];
                    }

                    const newCorrectIndex = options.findIndex(opt => opt.sentence === correctOption.sentence && opt.translation === correctOption.translation);

                    setSentenceChallenge({
                        options: options,
                        correctIndex: newCorrectIndex,
                    });
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(content.error_fetch_challenge);
                    console.error(err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingChallenge(false);
                }
            }
        };

        fetchChallenge();

        return () => {
            controller.abort();
        };
    }, [dailyWord, targetLanguage, nativeLanguage, content]);
    
    const handlePlayAudio = useCallback(() => {
        if (dailyWord) {
            play(dailyWord.word, targetLanguage);
        }
    }, [dailyWord, targetLanguage, play]);
    
    const handleContinueToChallenge = () => {
        setLearningStep('CHALLENGE');
    };

    const handleReviewLesson = () => {
        setLearningStep('WORD');
    };
    
    const handleCorrectAnswer = useCallback(() => {
        if (!dailyWord) return;
        const isFirstTry = quizAttemptsRef.current === 1;
        if (isFirstTry) {
            triggerHaptic('success');
        }
        onLessonComplete(dailyWord, isFirstTry);
    }, [dailyWord, onLessonComplete]);
    
    const onAttempt = useCallback(() => {
        quizAttemptsRef.current += 1;
    }, []);


    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-100 dark:bg-red-900/40 border border-red-400/50 dark:border-red-500/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">{content.error_oops}</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            {isLoadingWord ? (
                <div className="pt-24">
                    <LoadingSpinner loadingText={content.loading_word} />
                </div>
            ) : dailyWord ? (
                <>
                    {learningStep === 'WORD' && (
                        <div>
                            <WordCard
                                wordData={dailyWord}
                                etymologyTitle={content.word_card_etymology_title}
                                exampleTitle={content.word_card_example_title}
                                onPlayAudio={handlePlayAudio}
                                isAudioPlaying={isPlaying}
                            />
                            <button
                                onClick={handleContinueToChallenge}
                                className="mt-8 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                            >
                                <span>{content.learning_continue_button}</span>
                            </button>
                        </div>
                    )}
                    
                    {learningStep === 'CHALLENGE' && (
                        <div>
                            {isLoadingChallenge ? (
                                <div className="pt-8">
                                    <LoadingSpinner loadingText={content.loading_challenge} />
                                </div>
                            ) : sentenceChallenge ? (
                                <MultipleChoiceChallenge
                                    options={sentenceChallenge.options}
                                    correctIndex={sentenceChallenge.correctIndex}
                                    title={content.challenge_multiple_choice_title}
                                    description={content.challenge_multiple_choice_description}
                                    checkButtonText={content.challenge_check_button}
                                    continueButtonText={content.feedback_continue_button}
                                    reviewButtonText={content.lesson_review_button}
                                    correctFeedbackText={content.feedback_correct_title}
                                    incorrectFeedbackText={content.feedback_incorrect_title}
                                    wordToHighlight={dailyWord.word}
                                    onCorrect={handleCorrectAnswer}
                                    onIncorrect={handleReviewLesson}
                                    onAttempt={onAttempt}
                                />
                            ) : null}
                        </div>
                    )}
                </>
            ) : !error ? (
                <div className="p-8 text-center text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 rounded-xl">
                    <p>{content.no_word_loaded}</p>
                </div>
            ) : null}
        </div>
    );
};

export default memo(Learning);