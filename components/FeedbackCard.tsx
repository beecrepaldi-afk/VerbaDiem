import React, { memo } from 'react';
import { Evaluation } from '../types';

interface FeedbackCardProps {
  evaluation: Evaluation;
  title: string;
  goodJobText: string;
  almostThereText: string;
  creativityText: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex justify-center">
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-6 h-6 ${i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const FeedbackCard: React.FC<FeedbackCardProps> = ({ evaluation, title, goodJobText, almostThereText, creativityText }) => {
  const { isValid, rating, feedback } = evaluation;

  return (
    <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        
        {isValid ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-sm font-semibold px-4 py-1 rounded-full">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {goodJobText}
            </div>
        ) : (
             <div className="mt-3 inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-semibold px-4 py-1 rounded-full">
                 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.273-1.438 3.29-.537l.076.065 5.228 4.357c1.028.857.92 2.472-.23 3.193l-.116.082-5.228 4.357c-1.028.857-2.67.62-3.488-.51l-.082-.12-5.228-8.714c-.818-1.363-.13-3.21.968-3.79l.13-.058 5.228-1.045zM9 13a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z" clipRule="evenodd" /></svg>
                {almostThereText}
            </div>
        )}

        <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">{creativityText}</p>
            <StarRating rating={rating} />
        </div>

        <div className="mt-4 text-left bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{feedback}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(FeedbackCard);