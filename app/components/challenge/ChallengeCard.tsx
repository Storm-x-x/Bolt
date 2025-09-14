import React, { useState, useEffect } from 'react';

// utility to clear solved state on app load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('challenge-solved-')) {
        localStorage.removeItem(key);
      }
    });
  });
}

export type ChallengeCardProps = {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageAccuracy?: number; // percentage, optional for backward compatibility
  onClick?: () => void;
  solved?: boolean;
};

export function ChallengeCard({
  id,
  title,
  image,
  difficulty,
  averageAccuracy,
  onClick,
  solved: solvedProp,
}: ChallengeCardProps) {
  const [solved, setSolved] = useState(solvedProp || false);

  useEffect(() => {
    // listen for challenge:submit event and mark as solved if id matches
    function handleSubmit(e: CustomEvent) {
      if (e.detail && e.detail.id === id) {
        setSolved(true);
        localStorage.setItem(`challenge-solved-${id}`, '1');
      }
    }
    window.addEventListener('challenge:submit', handleSubmit as EventListener);

    // on mount, check localStorage
    if (localStorage.getItem(`challenge-solved-${id}`) === '1') {
      setSolved(true);
    }

    return () => {
      window.removeEventListener('challenge:submit', handleSubmit as EventListener);
    };
  }, [id]);

  const difficultyColor =
    difficulty === 'Easy' ? 'text-green-500' : difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500';

  return (
    <div
      className={`cursor-pointer bg-bolt-elements-background-depth-2 rounded-lg shadow border border-bolt-elements-borderColor hover:shadow-lg transition flex flex-col overflow-hidden group w-full max-w-xs mx-auto relative ${solved ? 'ring-4 ring-green-400 ring-opacity-60' : ''}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open challenge ${title}`}
      style={{ minHeight: 220 }}
    >
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
        {solved && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-400/40 text-white font-extrabold text-xl rounded-lg transition-all duration-300">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 opacity-80">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
              <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="opacity-90">Solved!</span>
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-bolt-elements-textPrimary truncate" title={title}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {typeof averageAccuracy === 'number' && (
              <span className="text-xs font-semibold text-blue-500 flex items-center">
                {averageAccuracy}%
                <span className="mx-2 h-4 border-l border-bolt-elements-borderColor" />
              </span>
            )}
            <span className={`text-xs font-semibold ${difficultyColor}`}>{difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
