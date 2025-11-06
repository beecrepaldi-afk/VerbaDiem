import { useState, useCallback, useRef, useEffect } from 'react';
import { getPronunciationAudio } from '../services/geminiService';
import { decodeAudioData, decode } from '../utils/audio';
import { Language } from '../types';

export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentlyPlayingWord, setCurrentlyPlayingWord] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioCacheRef = useRef<Record<string, string>>({});

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.error("AudioContext is not supported by this browser.", e);
            }
        }
        return audioContextRef.current;
    }, []);

    const playAudioData = useCallback(async (base64Audio: string) => {
        const ctx = getAudioContext();
        if (!ctx) return;

        setIsPlaying(true);
        try {
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => {
                setIsPlaying(false);
                setCurrentlyPlayingWord(null);
            };
            source.start();
        } catch (e) {
            console.error("Failed to decode or play audio", e);
            setIsPlaying(false);
            setCurrentlyPlayingWord(null);
        }
    }, [getAudioContext]);

    const play = useCallback(async (word: string, targetLanguage: Language) => {
        if (isPlaying) return;

        setCurrentlyPlayingWord(word);
        setIsPlaying(true);

        // Check cache first
        if (audioCacheRef.current[word]) {
            await playAudioData(audioCacheRef.current[word]);
            return;
        }

        try {
            const base64Audio = await getPronunciationAudio(word, targetLanguage);
            audioCacheRef.current[word] = base64Audio;
            await playAudioData(base64Audio);
        } catch (err) {
            console.error("Failed to fetch audio for", word, err);
            setIsPlaying(false);
            setCurrentlyPlayingWord(null);
        }
    }, [isPlaying, playAudioData]);
    
    const cleanup = useCallback(() => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    }, []);

    useEffect(() => {
        // Ensure cleanup is called on component unmount
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return { play, isPlaying, currentlyPlayingWord, cleanup };
};
