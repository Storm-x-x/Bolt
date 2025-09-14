import { useLocation } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { ChallengeChat as ChallengeChatFallback } from '~/components/chat/ChallengeChat';
import { ChallengeChatClient } from '~/components/chat/ChallengeChat.client';

export default function ChallengeCounter() {
  const location = useLocation();
  const { image, title, difficulty } = location.state || {};

  const challenge = {
    id: 'counter-ui',
    title: title || 'Build a Counter',
    question: '',
    image: image || '',
    difficulty: difficulty || 'Easy',
    averageAccuracy: 68, // default or from state if available
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start pb-10">
        <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
          {() => <ChallengeChatClient challenge={challenge} />}
        </ClientOnly>
      </div>
    </div>
  );
}
