import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useParams } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { ChallengeChat as ChallengeChatFallback } from '~/components/chat/ChallengeChat';
import { ChallengeChatClient } from '~/components/chat/ChallengeChat.client';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt - Challenge' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = () => json({});

export default function Challenge() {
  const { id } = useParams();

  console.log('Challenge ID:', id);

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <ClientOnly fallback={<ChallengeChatFallback />}>{() => <ChallengeChatClient />}</ClientOnly>
    </div>
  );
}