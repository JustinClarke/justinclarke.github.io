/**
 * Helper to safely access the Gemini API connection.
 */
export const getGeminiKey = (): string | null => {
  // @ts-ignore - process.env is injected by Vite define
  const key = process.env.GEMINI_API_KEY;
  
  if (!key || key === '') {
    console.warn('Gemini API: Key is missing. AI features will be disabled.');
    return null;
  }
  
  return key;
};

/**
 * Example wrapper for AI features that fails gracefully.
 */
export const safeAIRequest = async <T>(requestFn: (key: string) => Promise<T>): Promise<T | null> => {
  const key = getGeminiKey();
  if (!key) return null;

  try {
    return await requestFn(key);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};
