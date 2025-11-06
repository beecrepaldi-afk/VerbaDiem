import React, { memo } from 'react';
import { Language } from '../types';
import { LanguageNativeNames } from '../constants';

interface LanguageSelectorProps {
  label: string;
  selectedValue: Language;
  onLanguageChange: (language: Language) => void;
  languageOptions: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, selectedValue, onLanguageChange, languageOptions }) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
      <select
        value={selectedValue}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="w-full p-3 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition"
      >
        {languageOptions.map((lang) => (
          <option key={lang} value={lang}>
            {LanguageNativeNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(LanguageSelector);