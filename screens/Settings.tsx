import React, { memo } from 'react';
import { Language } from '../types';
import LanguageSelector from '../components/LanguageSelector';
import Icon from '../components/Icon';

interface SettingsProps {
    nativeLanguage: Language;
    targetLanguage: Language;
    onNativeLanguageChange: (language: Language) => void;
    onTargetLanguageChange: (language: Language) => void;
    onResetProgress: () => void;
    content: any;
}

const Settings: React.FC<SettingsProps> = ({ nativeLanguage, targetLanguage, onNativeLanguageChange, onTargetLanguageChange, onResetProgress, content }) => {
    const languageOptions = Object.values(Language);
    
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">{content.settings_title}</h1>
                
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{content.language_section_title}</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <LanguageSelector
                            label={content.language_selector_native_label}
                            selectedValue={nativeLanguage}
                            onLanguageChange={onNativeLanguageChange}
                            languageOptions={languageOptions}
                        />
                        <LanguageSelector
                            label={content.language_selector_target_label}
                            selectedValue={targetLanguage}
                            onLanguageChange={onTargetLanguageChange}
                            languageOptions={languageOptions}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{content.settings_feedback_section_title}</h2>
                     {/* TODO: Before publishing, change this back to an `a` tag and add your actual Google Play Store / App Store URL. */}
                     <button 
                        disabled={true}
                        className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name="star" className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">{content.settings_rate_app}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                </div>

                 <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{content.settings_legal_section_title}</h2>
                    <a 
                        href="https://beecrepaldi-afk.github.io/privacy-policy/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name="shield" className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                            <span className="font-semibold text-gray-800 dark:text-zinc-200">{content.settings_privacy_policy}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>
            </div>

            <div className="flex-grow min-h-[2rem]"></div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">{content.settings_danger_zone_title}</h2>
                <p className="text-base text-gray-600 dark:text-zinc-400 mb-4 text-justify hyphenate leading-relaxed">{content.settings_danger_zone_desc}</p>
                <button
                    onClick={onResetProgress}
                    className="w-full bg-red-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-black"
                >
                    <Icon name="trash" className="w-5 h-5" />
                    <span>{content.settings_reset_progress}</span>
                </button>
            </div>
        </div>
    );
};

export default memo(Settings);