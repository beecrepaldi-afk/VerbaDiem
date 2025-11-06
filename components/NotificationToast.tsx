
import React, { memo } from 'react';
import { Notification } from '../types';

interface NotificationToastProps {
    notifications: Notification[];
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications }) => {
    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 space-y-2">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className="bg-gray-800/80 dark:bg-zinc-900/80 backdrop-blur-md text-white font-semibold p-3 rounded-xl shadow-lg flex items-center justify-center gap-3 animate-fade-in"
                    style={{ animation: 'fadeInDown 0.5s, fadeOutUp 0.5s 2.5s forwards' }}
                >
                    {notif.icon}
                    <span>{notif.message}</span>
                </div>
            ))}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeOutUp {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to { opacity: 0; transform: translateY(-20px) scale(0.9); }
                }
            `}</style>
        </div>
    );
};

export default memo(NotificationToast);
