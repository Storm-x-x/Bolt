import { type MetaFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { Header } from '~/components/header/Header';
import { useState } from 'react';
import { ChallengeCard } from '~/components/challenge/ChallengeCard';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { getAllChallenges, type Challenge } from '~/lib/challenges';


const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'] as const;
const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'difficulty', label: 'Difficulty' },
];

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader: LoaderFunction = async () => {
  const challenges = await getAllChallenges();
  return { challenges };
};

export default function Index() {
  const navigate = useNavigate();
  const { challenges } = useLoaderData<{ challenges: Challenge[] }>();
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [sort, setSort] = useState<'title' | 'difficulty'>('title');
  const [search, setSearch] = useState('');

  const filtered = challenges.filter(
    (c) =>
      (difficulty === 'All' || c.difficulty === difficulty) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sort === 'difficulty') {
      return a.difficulty.localeCompare(b.difficulty);
    }

    return 0;
  });

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="min-h-screen bg-bolt-elements-background-depth-1 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="w-full px-0 md:px-0">
            <div
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4 w-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-400 rounded-lg shadow-lg border-0 p-4 md:p-6 transition-all duration-200"
              style={{
                minHeight: '90px',
                width: '100vw',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                position: 'relative',
              }}
            >
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg mb-1 leading-tight">
                  Solve Challenges
                </h1>
                <p className="text-base text-white/80 font-medium mt-0 drop-shadow-sm">
                  Browse and solve interactive UI challenges to sharpen your frontend skills.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-bolt-elements-background-depth-2 rounded-xl border border-bolt-elements-borderColor shadow-lg p-6 w-full max-w-4xl mx-auto transition-all duration-200">
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg px-4 py-2 border-0 bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 transition shadow-md text-base font-medium placeholder:text-bolt-elements-textSecondary"
            />
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-2 md:mt-0">
              <div className="flex gap-2 items-center bg-bolt-elements-background-depth-1 rounded-lg px-3 py-2 border border-bolt-elements-borderColor shadow-sm">
                <label htmlFor="difficulty" className="text-bolt-elements-textSecondary font-semibold text-sm mr-1">
                  Difficulty:
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="rounded px-2 py-1 border border-bolt-elements-borderColor bg-transparent text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 shadow-sm font-medium"
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center bg-bolt-elements-background-depth-1 rounded-lg px-3 py-2 border border-bolt-elements-borderColor shadow-sm">
                <label htmlFor="sort" className="text-bolt-elements-textSecondary font-semibold text-sm mr-1">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="rounded px-2 py-1 border border-bolt-elements-borderColor bg-transparent text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 shadow-sm font-medium"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sorted.map((challenge) => (
              <ChallengeCard key={challenge.id} {...challenge} onClick={() => navigate(`/challenge/${challenge.id}`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
