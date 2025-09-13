import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getSystemPrompt } from './prompts';
import { google } from "@ai-sdk/google"

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

// Use anthropic directly

export function streamText(messages: Messages, _env: Env, options?: StreamingOptions) {
  return _streamText({
    model: google("gemini-2.5-flash"),
    system: getSystemPrompt(),
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
