import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

export function getAnthropicModel(apiKey: string) {
  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic('claude-3-5-sonnet-20240620');
}

export function getAIStupidLevelModel(apiKey: string, model: string = 'auto-coding') {
  const openai = createOpenAI({
    apiKey,
    baseURL: 'https://aistupidlevel.info/v1',
  });

  return openai(model);
}
