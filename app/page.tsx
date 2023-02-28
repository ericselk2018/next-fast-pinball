import ClientApp from '@/components/ClientApp/ClientApp.client';

// We aren't really using pages or server-side components, but maybe will have some use case for this in the future.
// For now everything is client side, so we just render our client application component here.
export default function Home() {
	return <ClientApp />;
}
