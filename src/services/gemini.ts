import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// The AI Studio environment automatically handles process.env.GEMINI_API_KEY in Vite
export const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export const isGeminiConfigured = () => !!ai;
