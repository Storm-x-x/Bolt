import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey, getProvider, getAIStupidLevelModel as getAIStupidLevelModelName } from '~/lib/.server/llm/api-key';
import { getAnthropicModel, getAIStupidLevelModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  const provider = getProvider(env);
  
  if (provider === 'aistupidlevel') {
    const modelName = getAIStupidLevelModelName(env);
    const apiKey = getAPIKey(env, 'aistupidlevel');
    
    if (!apiKey) {
      throw new Error('AI Stupid Level API key is required when using aistupidlevel provider');
    }
    
    return _streamText({
      model: getAIStupidLevelModel(apiKey, modelName),
      system: getSystemPrompt(),
      maxTokens: MAX_TOKENS,
      messages: convertToCoreMessages(messages),
      ...options,
    });
  }
  
  // Default to Anthropic
  const anthropicApiKey = getAPIKey(env, 'anthropic');
  
  if (!anthropicApiKey) {
    throw new Error('Anthropic API key is required');
  }
  
  return _streamText({
    model: getAnthropicModel(anthropicApiKey),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    },
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
