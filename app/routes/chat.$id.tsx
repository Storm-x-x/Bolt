import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { default as IndexRoute } from './_index';
import { Header } from '~/components/header/Header';

export async function loader(args: LoaderFunctionArgs) {
  return json({ id: args.params.id });
}

export default function ChatPage(args: LoaderFunctionArgs) {
  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <Header />
      <IndexRoute {...args} />
    </div>
  );
}
