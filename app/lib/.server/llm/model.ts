import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getGoogleGenerativeAIModel(apiKey: string) {
  const google = createGoogleGenerativeAI({
    apiKey,
  });

  return google('gemini-1.5-flash');
}
