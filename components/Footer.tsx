import React, { memo } from 'react';

interface FooterProps {
    slogan: string;
}

const Footer: React.FC<FooterProps> = ({ slogan }) => {
    return (
        <footer className="w-full p-6">
            <p className="text-center text-sm text-gray-500 dark:text-zinc-700">{slogan}</p>
        </footer>
    );
};

export default memo(Footer);