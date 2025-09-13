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
      <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
        {() => <ChallengeChatClient challenge={challenge} />}
      </ClientOnly>
    </div>
  );
}