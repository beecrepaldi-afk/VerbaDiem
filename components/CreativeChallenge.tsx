import React, { memo } from 'react';

interface CreativeChallengeProps {
  onSubmit: (sentence: string) => void;
  isLoading: boolean;
  challengeText: string;
  setChallengeText: (text: string) => void;
  title: string;
  description: string;
  placeholder: string;
  submitButtonText: string;
  evaluatingButtonText: string;
}

const CreativeChallenge: React.FC<CreativeChallengeProps> = ({ onSubmit, isLoading, challengeText, setChallengeText, title, description, placeholder, submitButtonText, evaluatingButtonText }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (challengeText.trim()) {
      onSubmit(challengeText.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 animate-fade-in">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1 mb-4">{description}</p>
      
      <textarea
        value={challengeText}
        onChange={(e) => setChallengeText(e.target.value)}
        placeholder={placeholder}
        className="w-full h-24 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 dark:text-zinc-100"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !challengeText.trim()}
        className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {evaluatingButtonText}
          </>
        ) : (
          submitButtonText
        )}
      </button>
    </form>
  );
};

export default memo(CreativeChallenge);