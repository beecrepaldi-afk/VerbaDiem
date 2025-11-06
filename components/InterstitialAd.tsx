import React, { useEffect, useState } from 'react';

interface InterstitialAdProps {
  onClose: () => void;
  content: {
    ad_loading: string;
    ad_skip_in: string;
    ad_skip_button: string;
    ad_reward_message: string;
  };
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, content }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isAdReady, setIsAdReady] = useState(false);

  useEffect(() => {
    // Simulates a small delay for the ad script to load and inject itself.
    // This prevents a "broken" layout while the ad is not visible.
    const adLoadTimer = setTimeout(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            setIsAdReady(true);
        } catch (e) {
            console.error("AdSense error:", e);
            onClose(); // If there is an error, close the ad screen.
        }
    }, 1000);

    return () => clearTimeout(adLoadTimer);
  }, [onClose]);

  useEffect(() => {
    if (isAdReady && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAdReady, secondsLeft]);

  const canSkip = secondsLeft <= 0;

  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col items-center justify-center p-4 text-white animate-fade-in">
      <div className="w-full h-full flex flex-col border-4 border-gray-700 rounded-lg bg-gray-800">
        
        <div className="p-2 bg-zinc-900 flex justify-between items-center">
            <span className="text-sm text-gray-400 pl-2">{content.ad_reward_message}</span>
            <button
                onClick={onClose}
                disabled={!canSkip}
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-wait"
            >
                {canSkip ? content.ad_skip_button : `${content.ad_skip_in} ${secondsLeft}s`}
            </button>
        </div>

        {/* AdSense Ad Unit */}
        <div className="flex-1 flex items-center justify-center w-full px-4">
            {isAdReady ? (
                <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-8589848242278405"
                    data-ad-slot="5215606181"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            ) : (
                 <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-semibold">{content.ad_loading}</p>
                </div>
            )}
        </div>

      </div>
       <p className="absolute bottom-2 text-xs text-gray-500">Publicidade</p>
    </div>
  );
};

export default InterstitialAd;