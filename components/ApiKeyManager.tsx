import React from 'react';

interface ApiKeyManagerProps {
  onKeySelect: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeySelect }) => {
  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // Optimistically assume key is selected to improve UX and avoid race conditions.
        onKeySelect();
      } catch (e) {
        console.error("Failed to open API key selection:", e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-pop-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3m-3 5h6" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API Key Required</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-6">
          To use VerbaDiem, please select a Gemini API key. Using the API may incur costs.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          Select API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline mt-4 inline-block"
        >
          Learn more about billing
        </a>
      </div>
    </div>
  );
};

export default ApiKeyManager;
