import React, { useState, useCallback, useEffect } from 'react';
import { UserData, DailyWord, Language } from '../types';
import Icon from '../components/Icon';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface MemoryChestProps {
  userData: UserData;
  content: any;
  onStartReview: (wordIds?: string[]) => void;
  onCreateCollection: (name: string) => void;
  onOpenCollectionModal: (word: DailyWord) => void;
  targetLanguage: Language;
}

const MemoryChest: React.FC<MemoryChestProps> = ({ userData, content, onStartReview, onCreateCollection, onOpenCollectionModal, targetLanguage }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const { play, isPlaying, currentlyPlayingWord, cleanup } = useAudioPlayer();

  useEffect(() => {
    // This effect ensures that the AudioContext is properly closed when the user
    // navigates away from the Memory Chest, preventing potential memory leaks
    // or audio glitches.
    return () => {
        cleanup();
    };
  }, [cleanup]);

  const learnedWords = Object.values(userData.learnedWords);

  const handlePlayAudio = useCallback((word: string) => {
      play(word, targetLanguage);
  }, [play, targetLanguage]);

  const handleCreate = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };
  
  const handleReviewCollection = (wordIds: string[]) => {
      onStartReview(wordIds);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">{content.memory_chest_title}</h1>

      {learnedWords.length === 0 ? (
        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl">
          <Icon name="chest" className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-zinc-400">{content.memory_chest_empty_words}</p>
        </div>
      ) : (
        <>
          {/* Collections Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200">{content.memory_chest_collections}</h2>
            {userData.collections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.collections.map(collection => (
                  <div key={collection.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Icon name="folder" className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-gray-800 dark:text-zinc-200">{collection.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{collection.wordIds.length} words</p>
                    </div>
                    <button 
                        onClick={() => handleReviewCollection(collection.wordIds)}
                        disabled={collection.wordIds.length === 0}
                        className="mt-4 w-full text-sm bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Review
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-zinc-500 py-4">{content.memory_chest_empty_collections}</p>
            )}

            {isCreating ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder={content.collection_modal_new_placeholder}
                  className="flex-1 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl border-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button onClick={handleCreate} className="p-3 bg-blue-500 text-white rounded-xl font-semibold">Save</button>
              </div>
            ) : (
              <button onClick={() => setIsCreating(true)} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-200 dark:bg-zinc-800 rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors">
                <Icon name="plus" className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-500">{content.memory_chest_create_collection}</span>
              </button>
            )}
          </div>
          
          {/* All Words Section */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200">{content.memory_chest_all_words}</h2>
                <button onClick={() => onStartReview()} className="text-sm font-semibold text-blue-500 hover:underline">
                    {content.memory_chest_review_all}
                </button>
             </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-black/5 dark:border-white/10 shadow-sm max-h-96 overflow-y-auto">
              {learnedWords.map((word: DailyWord) => (
                <div key={word.word} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handlePlayAudio(word.word)}
                        disabled={isPlaying && currentlyPlayingWord === word.word}
                        className="p-2 -m-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        aria-label={`Play pronunciation for ${word.word}`}
                    >
                        {isPlaying && currentlyPlayingWord === word.word ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Icon name="speaker" className="w-5 h-5" />
                        )}
                    </button>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-zinc-200">{word.word}</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{word.translation}</p>
                    </div>
                  </div>
                  <button onClick={() => onOpenCollectionModal(word)} className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <Icon name="folder" className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryChest;