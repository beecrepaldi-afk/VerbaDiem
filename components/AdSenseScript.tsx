import React, { useEffect } from 'react';

interface AdSenseScriptProps {
    publisherId: string;
}

const AdSenseScript: React.FC<AdSenseScriptProps> = ({ publisherId }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        return () => {
            // Clean up the script when the component unmounts
            document.head.removeChild(script);
        };
    }, [publisherId]);

    return null; // This component doesn't render anything
};

export default AdSenseScript;
