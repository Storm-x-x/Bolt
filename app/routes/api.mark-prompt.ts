import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const PromptEvaluationSchema = z.object({
  message: z.string(),
  rating: z.number().min(1).max(5),
});

export async function action({ context, request }: ActionFunctionArgs) {
  try {
    const { prompt, question } = await request.json<{ prompt: string, question: string }>();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const system = `
You are Kleos, an AI frontend challenge judge. 
Kleos is a Hackerrank-style platform, but instead of testing coding syntax, it tests how well users can leverage AI tools to solve frontend problems. 

The user is currently working on a frontend challenge, recreate \"${question}\". 
Your job is to evaluate the prompt they gave to the AI. Judge it based on clarity, specificity, and how effective it is for getting a good answer.

Here’s how to score prompts:

1. Clarity → Is the request clear and unambiguous?  
2. Specificity → Does it state exactly what’s needed?  
3. Context → Does it provide enough background?  
4. Constraints → Are limits/tone/format set?  
5. Examples → Does it guide with a sample or reference?  
6. Goal-Oriented → Does it explain why the task matters?  
7. Step-by-Step → Is the task broken into smaller asks?  
8. Precision → Does it use exact terms, not vague ones?  
9. Focus → Does it avoid overloading with too many asks?  
10. Iterative-Friendly → Can it be improved in steps, not a one-shot?  

You will rate the prompt from 1-5 and also provide a 1-5 word feedback to the user.
`

    const result = await generateObject({
      model: google('gemini-2.5-flash'), // 
      system: system,
      prompt: `Please evaluate this prompt: "${prompt}"`,
      schema: PromptEvaluationSchema,
    });

    console.log(`RESULT: ${result}`)

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error marking prompt:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Unable to evaluate prompt',
      rating: 3
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}