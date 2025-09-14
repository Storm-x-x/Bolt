import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { atom } from 'nanostores';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import { type Challenge } from '~/lib/challenges';
import { getChallengeContext, clearChallengeContext } from '~/lib/challengeSession';
import { getMessages, getNextId, getUrlId, getChallengeNextId, openDatabase, setMessages } from './db';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
  challengeId?: string;
  challengeData?: Challenge;
}

const persistenceEnabled = !import.meta.env.VITE_DISABLE_PERSISTENCE;

export const db = persistenceEnabled ? await openDatabase() : undefined;

export const chatId = atom<string | undefined>(undefined);
export const description = atom<string | undefined>(undefined);

export function useChatHistory(idFromProps?: string) {
  const navigate = useNavigate();
  let mixedId: string | undefined = idFromProps;

  try {
    if (!mixedId) {
      // Only call useLoaderData if idFromProps is not provided
      const data = useLoaderData<{ id?: string }>();
      mixedId = data?.id;
    }
  } catch (e) {
    // Not in a loader-backed route, ignore
  }

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();
  const [chatData, setChatData] = useState<ChatHistoryItem | undefined>();

  useEffect(() => {
    if (!db) {
      setReady(true);

      if (persistenceEnabled) {
        toast.error(`Chat persistence is unavailable`);
      }

      return;
    }

    if (mixedId) {
      getMessages(db, mixedId)
        .then((storedMessages) => {
          if (storedMessages && storedMessages.messages.length > 0) {
            setInitialMessages(storedMessages.messages);
            setUrlId(storedMessages.urlId);
            setChatData(storedMessages);
            description.set(storedMessages.description);
            chatId.set(storedMessages.id);
          } else {
            navigate(`/`, { replace: true });
          }

          setReady(true);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, []);

  return {
    ready: !mixedId || ready,
    initialMessages,
    chatData,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db || messages.length === 0) {
        return;
      }

      const { firstArtifact } = workbenchStore;
      const challengeContext = getChallengeContext();

      if (!urlId && firstArtifact?.id) {
        const urlId = await getUrlId(db, firstArtifact.id);

        navigateChat(urlId);
        setUrlId(urlId);
      }

      if (!description.get()) {
        if (challengeContext?.challenge?.title) {
          description.set(challengeContext.challenge.title);
        } else if (firstArtifact?.title) {
          description.set(firstArtifact?.title);
        }
      }

      if (initialMessages.length === 0 && !chatId.get()) {
        let nextId: string;
        let generatedUrlId: string;

        if (challengeContext) {
          // Generate challenge-based ID
          generatedUrlId = await getChallengeNextId(db, challengeContext.challengeId);
          nextId = await getNextId(db);

          // Clear challenge context after first use
          clearChallengeContext();
        } else {
          // Regular ID generation
          nextId = await getNextId(db);
          generatedUrlId = urlId || nextId;
        }

        chatId.set(nextId);

        if (!urlId) {
          navigateChat(generatedUrlId);
          setUrlId(generatedUrlId);
        }
      }

      await setMessages(
        db,
        chatId.get() as string,
        messages,
        urlId,
        description.get(),
        challengeContext?.challengeId,
        challengeContext?.challenge
      );
    },
  };
}

function navigateChat(nextId: string) {
  /**
   * FIXME: Using the intended navigate function causes a rerender for <Chat /> that breaks the app.
   *
   * `navigate(`/chat/${nextId}`, { replace: true });`
   */
  const url = new URL(window.location.href);
  url.pathname = `/chat/${nextId}`;

  window.history.replaceState({}, '', url);
}
