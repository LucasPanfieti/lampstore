import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/actions/analytics";
import StorePage from "@/components/store/StorePage";
import { Store, Product } from "@/types";

interface Props {
  params: Promise<{ store: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store: storeSlug } = await params;
  const supabase = await createClient();

  const { data: storeData } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();
  const store = storeData as Store | null;

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
  const supabase = await createClient();

  // Fetch store and products
  const { data: storeData2 } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();
  const store = storeData2 as Store | null;

  if (!store) notFound();

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store!.id)
    .eq("active", true)
    .order("created_at", { ascending: false });
  const products = productsData as Product[] | null;

  // Track store view
  await trackEvent(store!.id, "store_view");

  return <StorePage store={store!} products={products ?? []} />;
}
