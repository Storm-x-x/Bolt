import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import { loadChallenge, type Challenge } from '~/lib/challenges';
import { ChallengeWorkbench } from '~/components/challenge/ChallengeWorkbench.client';
import { BaseChallengeWorkbench } from '~/components/challenge/BaseChallengeWorkbench';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.challenge) {
    return [{ title: 'Challenge Not Found - Kleos Frontend' }];
  }

  return [
    { title: `${data.challenge.title} - Kleos Frontend` },
    { name: 'description', content: data.challenge.question }
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const challengeId = params.id;

  if (!challengeId) {
    throw new Response('Not Found', { status: 404 });
  }

  const challenge = loadChallenge(challengeId);

  if (!challenge) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ challenge });
}

export default function ChallengePage() {
  const { challenge } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Challenge Description Panel */}
        <div className="w-80 border-r border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold text-bolt-elements-textPrimary mb-2">
                {challenge.title}
              </h1>
              <div className="text-sm text-bolt-elements-textSecondary">
                Challenge ID: {challenge.id}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">
                Problem Statement
              </h2>
              <div className="text-sm text-bolt-elements-textSecondary whitespace-pre-line">
                {challenge.question}
              </div>
            </div>
          </div>
        </div>

        {/* Editor and Preview Area */}
        <div className="flex-1 flex">
          <ClientOnly fallback={<BaseChallengeWorkbench />}>
            {() => <ChallengeWorkbench />}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}