export const triggerHaptic = (type: 'success' | 'light' | 'medium' | 'heavy') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
            switch (type) {
                case 'success':
                    navigator.vibrate([100, 30, 100]);
                    break;
                case 'light':
                    navigator.vibrate(50);
                    break;
                case 'medium':
                    navigator.vibrate(100);
                    break;
                case 'heavy':
                    navigator.vibrate(200);
                    break;
                default:
                    navigator.vibrate(75);
            }
        } catch (e) {
            console.warn("Haptic feedback failed", e);
        }
    }
};
