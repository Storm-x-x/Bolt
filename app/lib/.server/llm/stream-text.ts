import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getSystemPrompt } from './prompts';
import { anthropic } from '@ai-sdk/anthropic';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
  state: 'result';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  return _streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: getSystemPrompt(),
    messages: convertToCoreMessages(messages), 
    ...options,
  });
}
