



import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Language, View, DailyWord, UserData, Collection, Notification } from './types';
import { uiContent } from './translations';
import { XP_REWARDS, LEVELS, ACHIEVEMENTS, AD_FREQUENCY } from './constants';
import { triggerHaptic } from './utils/haptics';
import Icon from './components/Icon';

import Welcome from './screens/Welcome';
import Home from './screens/Home';
import Learning from './screens/Learning';
import LessonComplete from './screens/LessonComplete';
import Settings from './screens/Settings';
import Statistics from './screens/Statistics';
import Review from './screens/Review';
import Practice from './screens/Practice';
import MemoryChest from './screens/MemoryChest';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import Confetti from './components/Confetti';
import AddToCollectionModal from './components/AddToCollectionModal';
import ImageModal from './components/ImageModal';
import InterstitialAd from './components/InterstitialAd';
import AdSenseScript from './components/AdSenseScript';
import OnboardingGuide from './components/OnboardingGuide';

const initialUserData: UserData = {
    streak: { count: 0, lastCompletionDate: '' },
    longestStreak: 0,
    learnedWords: {},
    collections: [],
    xp: 0,
    level: 1,
    unlockedAchievements: [],
    practiceCount: 0,
    visualizeCount: 0,
    reviewCount: 0,
    relatedWordCount: 0,
    lessonsCompletedSinceAd: 0,
};

interface AdState {
    showAd: boolean;
    onAdCloseCallback: (() => void) | null;
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(() => {
    return localStorage.getItem('hasVisitedVerbaDiem') ? View.HOME : View.WELCOME;
  });
  
  const [nativeLanguage, setNativeLanguage] = useState<Language>(() => (localStorage.getItem('nativeLanguage') as Language) || Language.PORTUGUESE);
  const [targetLanguage, setTargetLanguage] = useState<Language>(() => (localStorage.getItem('targetLanguage') as Language) || Language.ENGLISH);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [dailyWord, setDailyWord] = useState<DailyWord | null>(null);
  const [reviewWords, setReviewWords] = useState<DailyWord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [wordForModal, setWordForModal] = useState<DailyWord | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageDataForModal, setImageDataForModal] = useState<{imageUrl: string; word: string; translation: string} | null>(null);
  const [adState, setAdState] = useState<AdState>({ showAd: false, onAdCloseCallback: null });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    const hasSeen = localStorage.getItem('hasSeenVerbaDiemOnboarding') === 'true';
    const hasVisited = localStorage.getItem('hasVisitedVerbaDiem') === 'true';
    return hasVisited && !hasSeen;
  });

  // --- Pre-loader Removal ---
  useEffect(() => {
    const preloader = document.getElementById('pre-loader');
    if (preloader) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        if(preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
        }
      }, 300); // Wait for fade-out animation
    }
  }, []);

  // --- Data Persistence and Migration ---
  useEffect(() => {
    const loadUserData = () => {
        try {
            const savedData = localStorage.getItem('verbaDiemUserData');
            if (savedData) {
                let parsedData = JSON.parse(savedData);
                
                // MIGRATION: learnedWords from array to object
                if (Array.isArray(parsedData.learnedWords)) {
                    const wordsObject: { [key: string]: DailyWord } = {};
                    parsedData.learnedWords.forEach((word: DailyWord) => {
                        wordsObject[word.word] = word;
                    });
                    parsedData.learnedWords = wordsObject;
                    if (!parsedData.collections) parsedData.collections = [];
                }
                
                // MIGRATION: counts from localStorage to userData
                if (typeof parsedData.practiceCount === 'undefined') {
                    parsedData.practiceCount = parseInt(localStorage.getItem('verbaDiemPracticeCount') || '0', 10);
                    parsedData.visualizeCount = parseInt(localStorage.getItem('verbaDiemVisualizeCount') || '0', 10);
                    parsedData.reviewCount = parseInt(localStorage.getItem('verbaDiemReviewCount') || '0', 10);
                    parsedData.relatedWordCount = parseInt(localStorage.getItem('verbaDiemRelatedCount') || '0', 10);
                    
                    localStorage.removeItem('verbaDiemPracticeCount');
                    localStorage.removeItem('verbaDiemVisualizeCount');
                    localStorage.removeItem('verbaDiemReviewCount');
                    localStorage.removeItem('verbaDiemRelatedCount');
                }

                // MIGRATION: Add lessonsCompletedSinceAd
                if (typeof parsedData.lessonsCompletedSinceAd === 'undefined') {
                    parsedData.lessonsCompletedSinceAd = 0;
                }

                setUserData({ ...initialUserData, ...parsedData }); // Ensure all fields from initialUserData are present
                return;
            }

            // Old migration from separate localStorage items
            const oldLearnedWords = localStorage.getItem('verbaDiemLearnedWords');
            if (oldLearnedWords) {
                const learnedArray = JSON.parse(oldLearnedWords);
                const migratedData: UserData = { ...initialUserData };
                
                learnedArray.forEach((word: DailyWord) => {
                    migratedData.learnedWords[word.word] = word;
                });
                
                migratedData.xp = learnedArray.length * XP_REWARDS.LESSON_COMPLETE;
                const newLevel = LEVELS.slice().reverse().find(l => migratedData.xp >= l.xpThreshold);
                if (newLevel) migratedData.level = newLevel.level;
                
                setUserData(migratedData);
                localStorage.removeItem('verbaDiemLearnedWords'); // clean up old keys
                localStorage.removeItem('verbaDiemStreak');
                localStorage.removeItem('verbaDiemLongestStreak');
            } else {
                 setUserData(initialUserData);
            }
        } catch (e) {
            console.error("Failed to load or migrate user data", e);
            setUserData(initialUserData);
        }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('verbaDiemUserData', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('nativeLanguage', nativeLanguage);
  }, [nativeLanguage]);

  useEffect(() => {
    localStorage.setItem('targetLanguage', targetLanguage);
  }, [targetLanguage]);

  // --- Scroll Lock Logic ---
  useEffect(() => {
    const viewsToLock = [View.WELCOME, View.REVIEW, View.PRACTICE];
    const shouldLock = viewsToLock.includes(view) || isCollectionModalOpen || isImageModalOpen || adState.showAd || showOnboarding;

    if (shouldLock) {
        document.body.classList.add('scroll-lock');
    } else {
        document.body.classList.remove('scroll-lock');
    }
    
    // Cleanup function to ensure scroll lock is removed on component unmount
    return () => {
        document.body.classList.remove('scroll-lock');
    };
  }, [view, isCollectionModalOpen, isImageModalOpen, adState.showAd, showOnboarding]);

    const handleBackToHome = useCallback(() => {
        setDailyWord(null);
        setReviewWords([]);
        checkAchievements();
        setView(View.HOME);
    }, []); // checkAchievements is memoized, so this is safe

  // --- Android Back Button Handling ---
  useEffect(() => {
    // This effect handles the browser/Android back button for a more native feel.
    const handlePopState = (event: PopStateEvent) => {
      const nonHomeViews = [View.LEARNING, View.SETTINGS, View.STATISTICS, View.REVIEW, View.PRACTICE, View.MEMORY_CHEST];
      if (nonHomeViews.includes(view)) {
        // If we are in a sub-view, prevent the default back action (like leaving the page)
        // and instead navigate to our app's home screen.
        event.preventDefault();
        handleBackToHome();
      }
    };

    // When we navigate to a new "view", we push a state to the browser's history.
    // This allows the `popstate` event to fire when the user clicks the back button.
    if (view !== View.HOME && view !== View.WELCOME) {
      window.history.pushState({ view: view }, '');
    }

    // In a true native app using a wrapper like Capacitor, you would also listen
    // for the hardware back button event for more robust control.
    // e.g., Capacitor's App.addListener('backButton', handleBackToHome);

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view, handleBackToHome]);
  
  const content = useMemo(() => uiContent[nativeLanguage], [nativeLanguage]);
  
  const learnedWordKeys = useMemo(() => {
    if (!userData) return [];
    return Object.keys(userData.learnedWords);
  }, [userData?.learnedWords]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  // --- Notifications ---
  const showNotification = useCallback((notif: Omit<Notification, 'id'>) => {
      const newNotif = { ...notif, id: Date.now() };
      setNotifications(prev => [...prev, newNotif]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 3000);
  }, []);

  // --- Gamification Logic ---
  const checkAchievements = useCallback((triggerType?: string) => {
      setUserData(prevData => {
          if (!prevData) return null;
          let changed = false;
          const newAchievements = [...prevData.unlockedAchievements];

          ACHIEVEMENTS.forEach(ach => {
              if (!newAchievements.includes(ach.id)) {
                  let conditionMet = false;
                  if (ach.id === 'PERFECT_LESSON' && triggerType === 'perfect_quiz') {
                      conditionMet = true;
                  } else if (ach.condition(prevData)) {
                      conditionMet = true;
                  }
                  
                  if (conditionMet) {
                      newAchievements.push(ach.id);
                      changed = true;
                      showNotification({ type: 'achievement', message: content.notification_achievement_unlocked, icon: <Icon name="medal" className="w-5 h-5" /> });
                      triggerHaptic('success');
                      triggerConfetti();
                  }
              }
          });

          return changed ? { ...prevData, unlockedAchievements: newAchievements } : prevData;
      });
  }, [content, showNotification, triggerConfetti]);

  const addXp = useCallback((amount: number, type: string) => {
    showNotification({ type: 'xp', message: `+${amount} XP` });

    setUserData(prevData => {
        if (!prevData) return null;

        // 1. Calculate new XP and Level
        const newXp = prevData.xp + amount;
        const currentLevelInfo = LEVELS.find(l => l.level === prevData.level) || LEVELS[0];
        const nextLevelInfo = LEVELS.find(l => l.level === prevData.level + 1);

        if (nextLevelInfo && newXp >= nextLevelInfo.xpThreshold) {
            showNotification({ type: 'level', message: content.notification_level_up, icon: <Icon name="trophy" className="w-5 h-5" /> });
            triggerHaptic('success');
            triggerConfetti();
        }
        const newLevel = LEVELS.slice().reverse().find(l => newXp >= l.xpThreshold)?.level || prevData.level;
        let updatedData = { ...prevData, xp: newXp, level: newLevel };

        // 2. Check for achievements on the updated data
        let achievementsChanged = false;
        const newAchievements = [...updatedData.unlockedAchievements];

        ACHIEVEMENTS.forEach(ach => {
            if (!newAchievements.includes(ach.id)) {
                let conditionMet = false;
                // Use updatedData for condition checks to be immediate
                if (ach.id === 'PERFECT_LESSON' && type === 'perfect_quiz') {
                    conditionMet = true;
                } else if (ach.condition(updatedData)) {
                    conditionMet = true;
                }
                
                if (conditionMet) {
                    newAchievements.push(ach.id);
                    achievementsChanged = true;
                    showNotification({ type: 'achievement', message: content.notification_achievement_unlocked, icon: <Icon name="medal" className="w-5 h-5" /> });
                    triggerHaptic('success');
                    triggerConfetti();
                }
            }
        });

        if (achievementsChanged) {
            updatedData.unlockedAchievements = newAchievements;
        }

        return updatedData;
    });
  }, [content, showNotification, triggerConfetti]);

  // --- Event Handlers ---
  const handleLessonComplete = useCallback((wordData: DailyWord, isFirstTry: boolean) => {
    if (!userData) return;
    
    setDailyWord(wordData);
    
    const lessonsCompleted = userData.lessonsCompletedSinceAd || 0;
    const shouldShowAd = lessonsCompleted >= AD_FREQUENCY - 1;

    const rewardAndStateUpdate = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const lessonAlreadyCompletedToday = userData.streak.lastCompletionDate === todayStr;

        if (!lessonAlreadyCompletedToday) {
            addXp(XP_REWARDS.LESSON_COMPLETE, 'lesson_complete');
            if (isFirstTry) {
                addXp(XP_REWARDS.PERFECT_QUIZ, 'perfect_quiz');
            }
        }
        
        setUserData(prevData => {
            if (!prevData) return null;
            let newUserData = { ...prevData };

            if (!lessonAlreadyCompletedToday) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                const isContinuingStreak = prevData.streak.lastCompletionDate === yesterdayStr;
                const newStreakCount = isContinuingStreak ? prevData.streak.count + 1 : 1;
                
                newUserData.streak = { count: newStreakCount, lastCompletionDate: todayStr };
                if (newStreakCount > prevData.longestStreak) {
                    newUserData.longestStreak = newStreakCount;
                }
            }
    
            if (!prevData.learnedWords[wordData.word]) {
                newUserData.learnedWords = { ...prevData.learnedWords, [wordData.word]: wordData };
            }
            
            newUserData.lessonsCompletedSinceAd = shouldShowAd ? 0 : (prevData.lessonsCompletedSinceAd || 0) + 1;
            
            return newUserData;
        });

        setView(View.LESSON_COMPLETE);
    };

    if (shouldShowAd) {
        setAdState({
            showAd: true,
            onAdCloseCallback: rewardAndStateUpdate,
        });
    } else {
        rewardAndStateUpdate();
    }
  }, [userData, addXp]);


  const handleFinishReview = useCallback(() => {
    addXp(XP_REWARDS.REVIEW_SESSION, 'review');
    setUserData(prev => prev ? ({ ...prev, reviewCount: (prev.reviewCount || 0) + 1 }) : null);
    handleBackToHome();
  }, [addXp, handleBackToHome]);
  
  const handleFindRelatedWord = useCallback(() => {
    addXp(XP_REWARDS.RELATED_WORD, 'related_word');
    setUserData(prev => prev ? ({ ...prev, relatedWordCount: (prev.relatedWordCount || 0) + 1 }) : null);
  }, [addXp]);
  
  const handleVisualizeWord = useCallback(() => {
      addXp(XP_REWARDS.VISUALIZE_WORD, 'visualize');
      setUserData(prev => prev ? ({ ...prev, visualizeCount: (prev.visualizeCount || 0) + 1 }) : null);
  }, [addXp]);

  const handleStart = useCallback(() => {
    localStorage.setItem('hasVisitedVerbaDiem', 'true');
    if (localStorage.getItem('hasSeenVerbaDiemOnboarding') !== 'true') {
        setShowOnboarding(true);
    }
    setView(View.HOME);
  }, []);
  
  const handleFinishPractice = useCallback(() => {
    addXp(XP_REWARDS.PRACTICE_SESSION, 'practice');
    setUserData(prev => prev ? ({ ...prev, practiceCount: (prev.practiceCount || 0) + 1 }) : null);
    handleBackToHome();
  }, [addXp, handleBackToHome]);

  const handleStartReview = useCallback((wordIds?: string[]) => {
    if (!userData) return;
    const wordsToReview = wordIds 
        ? wordIds.map(id => userData.learnedWords[id]).filter(Boolean)
        : Object.values(userData.learnedWords);

    if (wordsToReview.length === 0) return;
    const shuffled = [...wordsToReview].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setReviewWords(selected);
    setView(View.REVIEW);
  }, [userData]);
  
  const handleResetProgress = useCallback(() => {
    if (window.confirm(content.settings_reset_confirm)) {
        localStorage.clear();
        window.location.reload();
    }
  }, [content]);

  const handleHeaderBack = useCallback(() => {
    handleBackToHome();
  }, [handleBackToHome]);

  const handleAdClose = () => {
    if (adState.onAdCloseCallback) {
        adState.onAdCloseCallback();
    }
    setAdState({ showAd: false, onAdCloseCallback: null });
  };

  const handleReportWord = useCallback((word: DailyWord) => {
    const subject = `VerbaDiem Content Report: "${word.word}"`;
    // Pre-fill the email body with useful context for debugging.
    const body = `I would like to report an issue with the word "${word.word}" (${word.translation}).\n\nPlease describe the issue:\n\n\n---\nApp Details:\nNative Language: ${nativeLanguage}\nTarget Language: ${targetLanguage}`;
    
    window.location.href = `mailto:verbadiemapp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    showNotification({
        type: 'achievement', // Re-using a style for visual consistency.
        message: content.notification_report_sent,
        icon: <Icon name="flag" className="w-5 h-5" />
    });
  }, [showNotification, content.notification_report_sent, nativeLanguage, targetLanguage]);

  // --- Collection Handlers ---
  const handleOpenCollectionModal = useCallback((word: DailyWord) => {
    setWordForModal(word);
    setIsCollectionModalOpen(true);
  }, []);

  const handleUpdateCollections = useCallback((wordId: string, selectedCollectionIds: string[], newCollectionName?: string) => {
      if (!userData) return;
      setUserData(prev => {
          if (!prev) return null;
          let newCollections = [...prev.collections];
          
          if (newCollectionName) {
              const newCollection: Collection = {
                  id: Date.now().toString(),
                  name: newCollectionName,
                  wordIds: [wordId],
              };
              newCollections.push(newCollection);
              selectedCollectionIds.push(newCollection.id);
          }

          newCollections = newCollections.map(c => {
              const shouldHaveWord = selectedCollectionIds.includes(c.id);
              const hasWord = c.wordIds.includes(wordId);
              if (shouldHaveWord && !hasWord) return { ...c, wordIds: [...c.wordIds, wordId] };
              if (!shouldHaveWord && hasWord) return { ...c, wordIds: c.wordIds.filter(id => id !== wordId) };
              return c;
          });

          return { ...prev, collections: newCollections };
      });
      setIsCollectionModalOpen(false);
      setWordForModal(null);
  }, [userData]);

  const handleCreateCollection = useCallback((name: string) => {
      setUserData(prev => prev ? ({ ...prev, collections: [...prev.collections, { id: Date.now().toString(), name, wordIds: [] }]}) : null);
  }, []);

  const handleNativeLanguageChange = (lang: Language) => {
      if (lang === targetLanguage) {
          setTargetLanguage(nativeLanguage); // Swap
      }
      setNativeLanguage(lang);
  };
  
  const handleTargetLanguageChange = (lang: Language) => {
      if (lang === nativeLanguage) {
          setNativeLanguage(targetLanguage); // Swap
      }
      setTargetLanguage(lang);
  };
  
  const handleShowImageModal = useCallback((imageDataUrl: string, word: DailyWord) => {
    setImageDataForModal({
        imageUrl: imageDataUrl,
        word: word.word,
        translation: word.translation,
    });
    setIsImageModalOpen(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenVerbaDiemOnboarding', 'true');
    setShowOnboarding(false);
  };

  const renderView = () => {
    if (!userData) return null;

    switch (view) {
      case View.WELCOME: return <Welcome onStart={handleStart} content={content} />;
      case View.HOME: return <Home onStartLesson={() => setView(View.LEARNING)} onGoToSettings={() => setView(View.SETTINGS)} onGoToStatistics={() => setView(View.STATISTICS)} onGoToMemoryChest={() => setView(View.MEMORY_CHEST)} content={content} userData={userData} showOnboarding={showOnboarding} onOnboardingComplete={handleOnboardingComplete} />;
      case View.LEARNING: return <Learning nativeLanguage={nativeLanguage} targetLanguage={targetLanguage} content={content} onLessonComplete={handleLessonComplete} learnedWords={learnedWordKeys} onShowNotification={showNotification} />;
      case View.LESSON_COMPLETE:
        if (!dailyWord) { handleBackToHome(); return null; }
        return <LessonComplete dailyWord={dailyWord} userData={userData} content={content} onBackToHome={handleBackToHome} onFindRelatedWord={handleFindRelatedWord} onStartPractice={() => setView(View.PRACTICE)} onOpenCollectionModal={handleOpenCollectionModal} onVisualizeWord={handleVisualizeWord} onShowImageModal={(imageDataUrl) => handleShowImageModal(imageDataUrl, dailyWord)} nativeLanguage={nativeLanguage} targetLanguage={targetLanguage} onReportWord={handleReportWord} />;
      case View.REVIEW: return <Review reviewWords={reviewWords} content={content} onFinish={handleFinishReview} />;
      case View.PRACTICE:
          if (!dailyWord) { handleBackToHome(); return null; }
          return <Practice dailyWord={dailyWord} nativeLanguage={nativeLanguage} targetLanguage={targetLanguage} content={content} onFinish={handleFinishPractice} />;
      case View.SETTINGS: return <Settings nativeLanguage={nativeLanguage} targetLanguage={targetLanguage} onNativeLanguageChange={handleNativeLanguageChange} onTargetLanguageChange={handleTargetLanguageChange} onResetProgress={handleResetProgress} content={content} />;
      case View.STATISTICS: return <Statistics userData={userData} content={content} />;
      case View.MEMORY_CHEST: return <MemoryChest userData={userData} content={content} onStartReview={handleStartReview} onCreateCollection={handleCreateCollection} onOpenCollectionModal={handleOpenCollectionModal} targetLanguage={targetLanguage} />;
      default: return <Home onStartLesson={() => setView(View.LEARNING)} onGoToSettings={() => setView(View.SETTINGS)} onGoToStatistics={() => setView(View.STATISTICS)} onGoToMemoryChest={() => setView(View.MEMORY_CHEST)} content={content} userData={userData} showOnboarding={showOnboarding} onOnboardingComplete={handleOnboardingComplete} />;
    }
  };

  const showHeaderBack = [View.LEARNING, View.SETTINGS, View.STATISTICS, View.REVIEW, View.PRACTICE, View.MEMORY_CHEST].includes(view);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-200">
      <AdSenseScript publisherId="ca-pub-8589848242278405" />
      {adState.showAd && (
          <InterstitialAd 
              onClose={handleAdClose}
              content={{
                  ad_loading: content.ad_loading,
                  ad_skip_button: content.ad_skip_button,
                  ad_skip_in: content.ad_skip_in,
                  ad_reward_message: content.ad_reward_message,
              }}
          />
      )}
      {showConfetti && <Confetti />}
      <NotificationToast notifications={notifications} />
      {isCollectionModalOpen && wordForModal && userData && (
          <AddToCollectionModal
              word={wordForModal}
              collections={userData.collections}
              onClose={() => setIsCollectionModalOpen(false)}
              onSave={handleUpdateCollections}
              content={content}
          />
      )}
      {isImageModalOpen && imageDataForModal && (
          <ImageModal
              imageUrl={imageDataForModal.imageUrl}
              word={imageDataForModal.word}
              translation={imageDataForModal.translation}
              onClose={() => setIsImageModalOpen(false)}
          />
      )}
      <Header titlePart1={content.header_title1} titlePart2={content.header_title2} showBack={showHeaderBack} onBack={handleHeaderBack} streakData={userData?.streak} />
      <main key={view} className="flex-grow w-full max-w-2xl mx-auto animate-view-enter">
        {renderView()}
      </main>
      <Footer slogan={content.footer_slogan} />
    </div>
  );
};

export default App;