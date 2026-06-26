import { createOpenAI } from '@ai-sdk/openai';

export function isAiAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = openaiProvider('gpt-4o-mini', {
  structuredOutputs: true,
});
