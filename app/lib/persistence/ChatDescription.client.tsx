import { useStore } from '@nanostores/react';
import { description, useChatHistory } from './useChatHistory';

export function ChatDescription() {
  const regularDescription = useStore(description);
  const { chatData } = useChatHistory();

  // Priority: Challenge title > Regular description
  return chatData?.challengeData?.title || regularDescription;
}
