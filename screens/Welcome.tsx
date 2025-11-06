import React, { memo } from 'react';

interface WelcomeProps {
    onStart: () => void;
    content: {
        welcome_title: string;
        welcome_button: string;
        footer_slogan: string;
    };
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, content }) => {
    
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500 mb-6"></div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{content.welcome_title}</h1>
        <p className="mt-2 max-w-md text-lg text-gray-600 dark:text-zinc-400">{content.footer_slogan}</p>
        <button
            onClick={onStart}
            className="mt-8 bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-transform hover:scale-105 active:scale-95"
        >
            {content.welcome_button}
        </button>
    </div>
  );
};

export default memo(Welcome);