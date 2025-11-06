
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DailyWord, Language, SentenceChallenge, RelatedWord } from "../types";
import { LanguageEnglishNames } from '../constants';

// --- SECURITY NOTE ---
// This app uses a client-side implementation.
// For this to be secure, you MUST restrict your API key in the Google Cloud Console
// to only allow requests from your website's domain (e.g., your-app-name.vercel.app).

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const dailyWordSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    pronunciation: { type: Type.STRING },
    translation: { type: Type.STRING },
    etymology: { type: Type.STRING },
    example: { type: Type.STRING },
    exampleTranslation: { type: Type.STRING }
  },
  required: ["word", "pronunciation", "translation", "etymology", "example", "exampleTranslation"]
};

const sentenceChallengeSchema = {
    type: Type.OBJECT,
    properties: {
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { sentence: { type: Type.STRING }, translation: { type: Type.STRING } },
                required: ["sentence", "translation"]
            }
        },
        correctIndex: { type: Type.INTEGER }
    },
    required: ["options", "correctIndex"]
};

const relatedWordSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        translation: { type: Type.STRING },
        reason: { type: Type.STRING }
    },
    required: ["word", "translation", "reason"]
};

export async function fetchDailyWordOnline(targetLanguage: Language, nativeLanguage: Language, excludedWords: string[] = []): Promise<DailyWord> {
  const targetLanguageName = LanguageEnglishNames[targetLanguage];
  const nativeLanguageName = LanguageEnglishNames[nativeLanguage];

  let prompt = `Provide one and only one word in ${targetLanguageName} that has a very curious origin, an interesting history, or a funny story behind it. The word should be suitable for a beginner.
    - The word itself and the example sentence must be in ${targetLanguageName}.
    - All other fields (translation, pronunciation, etymology, exampleTranslation) MUST be in ${nativeLanguageName}. This is very important for the user to understand.`;

  if (excludedWords && excludedWords.length > 0) {
    prompt += `\n- CRITICAL: Do not select any of the following words, as the user has already learned them: ${excludedWords.join(', ')}.`;
  }

  try {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: dailyWordSchema,
            temperature: 0.9,
        },
    });

    const dailyWord = JSON.parse(result.text.trim());
    return dailyWord;
  } catch (error) {
    console.error("Error fetching daily word from Gemini:", error);
    throw new Error("Failed to get daily word from Gemini API.");
  }
}

export async function getSentenceChallenge(word: DailyWord, targetLanguage: Language, nativeLanguage: Language): Promise<SentenceChallenge> {
    const targetLanguageName = LanguageEnglishNames[targetLanguage];
    const nativeLanguageName = LanguageEnglishNames[nativeLanguage];
    
    const prompt = `The user is a beginner learning the word "${word.word}" (which means "${word.translation}") in ${targetLanguageName}. Create a multiple-choice question to test their understanding.
        All sentences must be very simple and basic, suitable for a beginner.
        Provide exactly three sentence options in ${targetLanguageName}.
        1. One sentence must use the word "${word.word}" correctly and naturally.
        2. The other two sentences must be plausible but use the word "${word.word}" incorrectly. The incorrect usage could be subtle, like using it in the wrong context, with the wrong preposition, or with a slightly wrong meaning. The sentences themselves should be grammatically correct.
        3. Provide the translation for all three sentences in ${nativeLanguageName}.
        4. Tell me the index (0, 1, or 2) of the correct sentence.`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sentenceChallengeSchema,
                temperature: 0.7,
            },
        });
        
        const challenge = JSON.parse(result.text.trim());
        if (!challenge.options || challenge.options.length !== 3 || challenge.correctIndex === undefined) {
             throw new Error("Invalid response structure from Gemini.");
        }
        return challenge;
    } catch (error) {
        console.error("Error fetching sentence challenge from Gemini:", error);
        throw new Error("Failed to get sentence challenge from Gemini API.");
    }
}

export async function getRelatedWord(dailyWord: DailyWord, targetLanguage: Language, nativeLanguage: Language): Promise<RelatedWord> {
    const targetLanguageName = LanguageEnglishNames[targetLanguage];
    const nativeLanguageName = LanguageEnglishNames[nativeLanguage];
    
    const prompt = `The user just learned the ${targetLanguageName} word "${dailyWord.word}" (which means "${dailyWord.translation}" in ${nativeLanguageName}).
        Find one other interesting, related ${targetLanguageName} word that a beginner could learn next.
        The relationship could be etymological (sharing a root), semantic (a synonym, antonym, or conceptually linked), or otherwise interesting.
        Provide the translation of this new word into ${nativeLanguageName}.
        Also provide a brief, engaging explanation in ${nativeLanguageName} about the connection between the two words.`;
        
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: relatedWordSchema,
                temperature: 0.7,
            },
        });
        
        const relatedWord = JSON.parse(result.text.trim());
        return relatedWord;
    } catch (error) {
        console.error("Error fetching related word from Gemini:", error);
        throw new Error("Failed to get related word from Gemini API.");
    }
}

export async function getMnemonicImage(dailyWord: DailyWord, nativeLanguage: Language): Promise<string> {
    const nativeLanguageName = LanguageEnglishNames[nativeLanguage];

    const prompt = `Create an artistic, memorable, and slightly surreal image that serves as a mnemonic for a language learner.
        The word is "${dailyWord.word}" (which means "${dailyWord.translation}" in ${nativeLanguageName}).
        The etymology/origin is: "${dailyWord.etymology}".
        The image should visually represent the CORE CONCEPT of the word, inspired by its meaning and etymology.
        Style: Whimsical, storybook illustration style. Evocative, beautiful, high contrast, vivid colors. Digital painting.
        IMPORTANT: DO NOT include any text, letters, or words in the image. The image must be purely visual.`;
        
    try {
        const result = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes = result.generatedImages[0].image.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("No image data received from Gemini API.");
        }
        return base64ImageBytes;
    } catch (error) {
        console.error("Error fetching mnemonic image from Gemini:", error);
        throw new Error("Failed to get mnemonic image from Gemini API.");
    }
}


export async function getPronunciationAudio(word: string, targetLanguage: Language): Promise<string> {
  const targetLanguageName = LanguageEnglishNames[targetLanguage];
  const prompt = `Pronounce the ${targetLanguageName} word: ${word}`;

  try {
     const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
        },
    });
    const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from Gemini API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error fetching pronunciation audio from Gemini:", error);
    throw new Error("Failed to get pronunciation audio from Gemini API.");
  }
}
