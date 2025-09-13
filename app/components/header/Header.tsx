import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { Link, useLocation } from '@remix-run/react';

export function Header() {
  const chat = useStore(chatStore);
  const location = useLocation();

  return (
    <header
      className={classNames(
        'flex flex-col items-center bg-bolt-elements-background-depth-1 p-5 border-b h-[var(--header-height)] z-10',
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        },
      )}
    >
      {/* Navbar */}
      <nav className="flex gap-2 justify-center w-full">
        <Link
          to="/"
          className={classNames(
            'px-4 py-2 rounded text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition',
            { 'bg-bolt-elements-background-depth-2 font-bold': location.pathname === '/' },
          )}
        >
          Solve
        </Link>
        <Link
          to="/profile"
          className={classNames(
            'px-4 py-2 rounded text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition',
            { 'bg-bolt-elements-background-depth-2 font-bold': location.pathname === '/profile' },
          )}
        >
          Profile
        </Link>
      </nav>
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="mr-1">
              <HeaderActionButtons />
            </div>
          )}
        </ClientOnly>
      )}
    </header>
  );
}
