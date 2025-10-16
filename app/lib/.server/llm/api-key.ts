import { env } from 'node:process';

export type Provider = 'anthropic' | 'aistupidlevel';

export function getAPIKey(cloudflareEnv: Env, provider: Provider = 'anthropic') {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  if (provider === 'aistupidlevel') {
    return env.AI_STUPID_LEVEL_API_KEY || cloudflareEnv.AI_STUPID_LEVEL_API_KEY;
  }
  
  return env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
}

export function getProvider(cloudflareEnv: Env): Provider {
  const provider = env.LLM_PROVIDER || cloudflareEnv.LLM_PROVIDER || 'anthropic';
  return provider as Provider;
}

export function getAIStupidLevelModel(cloudflareEnv: Env): string {
  return env.AI_STUPID_LEVEL_MODEL || cloudflareEnv.AI_STUPID_LEVEL_MODEL || 'auto-coding';
}
