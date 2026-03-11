import { notFound } from "next/navigation";
import { Metadata } from "next";
import { after } from "next/server";
import { trackEvent } from "@/lib/actions/analytics";
import StorePage from "@/components/store/StorePage";
import { getStoreBySlug, getActiveStoreProducts } from "@/lib/queries/store";

interface Props {
  params: Promise<{ store: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store: storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    return { title: "Loja não encontrada — LampStore" };
  }

  return {
    title: `${store.name} — LampStore`,
    description: store.bio ?? `Confira os produtos de ${store.name}`,
    openGraph: {
      title: store.name,
      description: store.bio ?? `Confira os produtos de ${store.name}`,
      type: "website",
    },
  };
}

export default async function StorePageRoute({ params }: Props) {
  const { store: storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) notFound();

  const products = await getActiveStoreProducts(store.id);

  // Non-blocking analytics tracking — does not delay page render
  after(() => trackEvent(store.id, "store_view"));

  return <StorePage store={store} products={products} />;
}
