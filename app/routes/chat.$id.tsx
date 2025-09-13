import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';

export async function loader(args: LoaderFunctionArgs) {
  return json({ id: args.params.id });
}

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <Chat />}
      </ClientOnly>
    </div>
  );
}
