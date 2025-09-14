import React from 'react';
import { useNavigate } from '@remix-run/react';

export function BackToChallengesButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-bolt-elements-button-secondary-background hover:bg-bolt-elements-button-secondary-backgroundHover text-bolt-elements-button-secondary-text font-semibold shadow border border-bolt-elements-borderColor transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60"
      style={{ minWidth: 0 }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline-block mr-1">
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}
