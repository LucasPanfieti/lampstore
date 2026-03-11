import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/actions/analytics";
import StorePage from "@/components/store/StorePage";
import { Store, Product } from "@/types";

interface Props {
  params: Promise<{ store: string }>;
}

// cache() deduplicates DB calls between generateMetadata and the page render
const getStoreBySlug = cache(async (storeSlug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();
  return data as Store | null;
});

const getStoreProducts = cache(async (storeId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("created_at", { ascending: false });
  return (data as Product[] | null) ?? [];
});

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

  const products = await getStoreProducts(store.id);

  // Non-blocking analytics tracking — does not delay page render
  after(() => trackEvent(store.id, "store_view"));

  return <StorePage store={store} products={products} />;
}
