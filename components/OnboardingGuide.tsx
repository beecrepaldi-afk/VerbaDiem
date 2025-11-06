import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface OnboardingStep {
    targetId: string;
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingGuideProps {
    steps: OnboardingStep[];
    onComplete: () => void;
    content: any;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ steps, onComplete, content }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const tooltipRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const updatePosition = () => {
            const currentStep = steps[currentStepIndex];
            if (!currentStep) return;

            const targetElement = document.getElementById(currentStep.targetId);
            if (!targetElement) return;

            const targetRect = targetElement.getBoundingClientRect();
            
            let style: React.CSSProperties = { opacity: 1, transform: 'scale(1)' };
            
            // Highlight the target element
            targetElement.style.zIndex = '10001';
            targetElement.style.position = 'relative';

            // Add a highlight box
            const highlightBox = document.createElement('div');
            highlightBox.style.position = 'absolute';
            highlightBox.style.left = `${targetRect.left}px`;
            highlightBox.style.top = `${targetRect.top}px`;
            highlightBox.style.width = `${targetRect.width}px`;
            highlightBox.style.height = `${targetRect.height}px`;
            highlightBox.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.6)';
            highlightBox.style.borderRadius = '12px';
            highlightBox.style.zIndex = '10000';
            highlightBox.id = 'onboarding-highlight';
            document.body.appendChild(highlightBox);


            const tooltipHeight = tooltipRef.current?.offsetHeight || 100;
            const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
            const gap = 12;

            switch (currentStep.position) {
                case 'bottom':
                    style.top = `${targetRect.bottom + gap}px`;
                    style.left = `${targetRect.left + targetRect.width / 2 - tooltipWidth / 2}px`;
                    break;
                case 'top':
                    style.top = `${targetRect.top - tooltipHeight - gap}px`;
                    style.left = `${targetRect.left + targetRect.width / 2 - tooltipWidth / 2}px`;
                    break;
                // Add left/right cases if needed
            }
            
            // Boundary checks to keep tooltip on screen
            if (style.left && typeof style.left === 'string') {
                 if (parseInt(style.left) < gap) style.left = `${gap}px`;
                 if (parseInt(style.left) + tooltipWidth > window.innerWidth - gap) {
                     style.left = `${window.innerWidth - tooltipWidth - gap}px`;
                 }
            }


            setTooltipStyle(style);
        }

        // Delay to allow UI to render
        const timer = setTimeout(updatePosition, 100);

        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
            const targetElement = document.getElementById(steps[currentStepIndex]?.targetId);
            if (targetElement) {
                targetElement.style.zIndex = '';
                targetElement.style.position = '';
            }
            const highlightBox = document.getElementById('onboarding-highlight');
            if (highlightBox) {
                document.body.removeChild(highlightBox);
            }
        };

    }, [currentStepIndex, steps]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onComplete();
        }
    };
    
    if (steps.length === 0) return null;
    const currentStep = steps[currentStepIndex];

    return (
        <div className="fixed inset-0 z-[9999]">
             <div 
                ref={tooltipRef}
                className="fixed bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-lg p-4 shadow-2xl max-w-xs w-full transition-all duration-300"
                style={{ ...tooltipStyle, opacity: 0, transform: 'scale(0.95)' }}
            >
                <button onClick={onComplete} className="absolute top-2 right-2 p-1 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300">
                    <Icon name="close" className="w-5 h-5" />
                </button>
                <p className="mb-4 pr-4">{currentStep.text}</p>
                <div className="flex justify-between items-center">
                    <div className="flex gap-1.5">
                        {steps.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full ${index === currentStepIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-600'}`}></div>
                        ))}
                    </div>
                    <button onClick={handleNext} className="bg-blue-500 text-white font-semibold py-2 px-5 rounded-md text-sm">
                        {currentStepIndex === steps.length - 1 ? content.onboarding_finish : content.onboarding_next}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;
