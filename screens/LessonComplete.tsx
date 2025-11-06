import React, { useState, memo } from 'react';
import { DailyWord, Language, RelatedWord, UserData } from '../types';
import { getRelatedWord, getMnemonicImage } from '../services/geminiService';
import Icon from '../components/Icon';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAudioPlayer } from '../hooks/useAudioPlayer';


interface LessonCompleteProps {
    dailyWord: DailyWord;
    userData: UserData;
    content: any;
    onBackToHome: () => void;
    onVisualizeWord: () => void;
    onShowImageModal: (imageDataUrl: string) => void;
    onFindRelatedWord: () => void;
    onStartPractice: () => void;
    onOpenCollectionModal: (word: DailyWord) => void;
    onReportWord: (word: DailyWord) => void;
    nativeLanguage: Language;
    targetLanguage: Language;
}

const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ComponentProps<typeof Icon>['name'];
    label: string;
    disabled?: boolean;
    loading?: boolean;
}> = ({ onClick, icon, label, disabled = false, loading = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 active:bg-gray-200/80 dark:active:bg-zinc-700/80"
    >
        <div className="w-7 h-7 flex items-center justify-center">
             {loading ? (
                <svg className="animate-spin h-5 w-5 text-gray-600 dark:text-zinc-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <Icon name={icon} className="w-6 h-6 text-gray-600 dark:text-zinc-300" />
            )}
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-zinc-200">{label}</span>
    </button>
);


const LessonComplete: React.FC<LessonCompleteProps> = ({ dailyWord, userData, content, onBackToHome, onVisualizeWord, onShowImageModal, onFindRelatedWord, onStartPractice, onOpenCollectionModal, onReportWord, nativeLanguage, targetLanguage }) => {
    const [relatedWord, setRelatedWord] = useState<RelatedWord | null>(null);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);
    
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    
    const { play, isPlaying, currentlyPlayingWord } = useAudioPlayer();

    const handleFindRelatedWord = async () => {
        setIsLoadingRelated(true);
        setRelatedError(null);
        setRelatedWord(null);
        try {
            const result = await getRelatedWord(dailyWord, targetLanguage, nativeLanguage);
            setRelatedWord(result);
            onFindRelatedWord(); // Grant XP
        } catch (err) {
            setRelatedError(content.error_fetch_word);
            console.error(err);
        } finally {
            setIsLoadingRelated(false);
        }
    };

    const handleVisualize = async () => {
        if (imageData) {
            onShowImageModal(imageData);
            return;
        }

        setIsLoadingImage(true);
        setImageError(null);
        try {
            const result = await getMnemonicImage(dailyWord, nativeLanguage);
            const dataUrl = `data:image/jpeg;base64,${result}`;
            setImageData(dataUrl);
            onShowImageModal(dataUrl);
            onVisualizeWord(); // Grant XP and track for achievement
        } catch (err) {
            setImageError(content.error_fetch_image);
            console.error(err);
        } finally {
            setIsLoadingImage(false);
        }
    };

    return (
        <div className="flex flex-col h-full text-center">
            <div className="flex-grow space-y-6 overflow-y-auto pb-4">
                 <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                     <Icon name="trophy" className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{content.lesson_complete_title}</h1>
                
                <div className="flex items-center justify-center gap-2 text-amber-500 font-bold">
                    <Icon name="flame" className="w-6 h-6 animate-pulse-flame" />
                    <span className="text-2xl">{userData.streak.count}</span>
                    <p className="text-lg text-gray-600 dark:text-zinc-400 font-medium ml-1">{content.home_streak_title}</p>
                </div>

                <div className="w-full max-w-md mx-auto space-y-3 pt-4 px-1">
                    {isLoadingRelated && <LoadingSpinner loadingText={content.lesson_complete_related_word_loading} />}
                    {relatedError && <p className="text-red-500">{relatedError}</p>}
                    
                    {relatedWord && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 text-left animate-fade-in">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{content.lesson_complete_related_word_title}</h2>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <p className="text-2xl font-bold text-blue-500">{relatedWord.word}</p>
                                   <button
                                        onClick={() => play(relatedWord.word, targetLanguage)}
                                        disabled={isPlaying}
                                        className="p-2 -m-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                                        aria-label={`Play pronunciation for ${relatedWord.word}`}
                                    >
                                        {isPlaying && currentlyPlayingWord === relatedWord.word ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Icon name="speaker" className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-md font-medium text-gray-700 dark:text-zinc-300">{relatedWord.translation}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
                                 <p className="text-base text-gray-600 dark:text-zinc-400 leading-relaxed text-justify hyphenate">
                                    <span className="font-semibold">{content.related_word_reason_prefix}</span> {relatedWord.reason}
                                </p>
                            </div>
                        </div>
                    )}

                    {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                </div>
            </div>

            <div className="w-full max-w-md mx-auto pt-4 pb-2">
                 <div className="grid grid-cols-4 gap-3 mb-4">
                    <ActionButton
                        onClick={handleFindRelatedWord}
                        icon="sparkles"
                        label={content.lesson_complete_related_word_button}
                        disabled={isLoadingRelated || !!relatedWord}
                    />
                    <ActionButton
                        onClick={handleVisualize}
                        icon="eye"
                        label={!imageData ? content.lesson_complete_visualize_button : content.lesson_complete_view_mnemonic_button}
                        disabled={isLoadingImage}
                        loading={isLoadingImage}
                    />
                     <ActionButton
                        onClick={() => onOpenCollectionModal(dailyWord)}
                        icon="folder"
                        label={content.lesson_complete_collection_button}
                    />
                     <ActionButton
                        onClick={() => onReportWord(dailyWord)}
                        icon="flag"
                        label={content.lesson_complete_report_button}
                    />
                </div>
                
                <div className="space-y-3">
                     <button
                        onClick={onStartPractice}
                        className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
                    >
                        <Icon name="chat" className="w-5 h-5" />
                        <span>{content.lesson_complete_practice_button}</span>
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="w-full text-gray-600 dark:text-zinc-400 font-semibold py-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-xl"
                    >
                        <span>{content.lesson_complete_back_home_button}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(LessonComplete);