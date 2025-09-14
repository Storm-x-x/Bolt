import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { ChallengeChat as ChallengeChatFallback } from '~/components/chat/ChallengeChat';
import { ChallengeChatClient } from '~/components/chat/ChallengeChat.client';
import { Header } from '~/components/header/Header';
import { getChallengeById, type Challenge } from '~/lib/challenges';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.challenge ? `${data.challenge.title} - Challenge` : 'Challenge Not Found';
  return [{ title }, { name: 'description', content: 'Code challenges powered by AI' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    throw new Response('Challenge ID is required', { status: 400 });
  }

  const challenge = await getChallengeById(id);

  if (!challenge) {
    throw new Response('Challenge not found', { status: 404 });
  }

  return json({ challenge });
}

export default function Challenge() {
  const { challenge } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="max-w-2xl mx-auto w-full mt-8 mb-4 p-6 bg-bolt-elements-background-depth-2 rounded-xl shadow-lg flex flex-col items-center">
        <img src={challenge.image} alt={challenge.title} className="h-32 w-auto mb-4 rounded-lg shadow" />
        <h1 className="text-3xl font-bold text-bolt-elements-accent mb-2 text-center">{challenge.title}</h1>
        <span
          className={`text-lg font-semibold mb-4 ${
            challenge.difficulty === 'Easy'
              ? 'text-green-500'
              : challenge.difficulty === 'Medium'
                ? 'text-yellow-500'
                : 'text-red-500'
          }`}
        >
          {challenge.difficulty}
        </span>
      </div>
      <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
        {() => <ChallengeChatClient challenge={challenge} />}
      </ClientOnly>
    </div>
  );
}
