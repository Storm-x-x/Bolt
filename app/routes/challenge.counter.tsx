import { useLocation } from '@remix-run/react';
import { Header } from '~/components/header/Header';
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
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <Header className="bg-bolt-elements-background-depth-2 shadow-md" />
      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-12 mb-0 p-0">
        {image && (
          <div className="w-full flex flex-col items-center justify-center mb-0">
            <img
              src={image}
              alt={title}
              className="h-[280px] w-auto max-w-full rounded-2xl shadow-2xl border-4 border-bolt-elements-background-depth-2 object-contain bg-bolt-elements-background-depth-1"
              style={{ objectFit: 'contain' }}
            />
            {title && (
              <h1 className="text-4xl font-extrabold text-white pt-4 mb-0 text-center drop-shadow-lg tracking-tight">
                {title}
              </h1>
            )}
            {difficulty && (
              <span
                className={`text-xs font-semibold mt-1 mb-2 opacity-60 ${difficulty === 'Easy' ? 'text-green-400' : difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}
              >
                {difficulty}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start pb-10">
        <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
          {() => <ChallengeChatClient challenge={challenge} />}
        </ClientOnly>
      </div>
    </div>
  );
}
