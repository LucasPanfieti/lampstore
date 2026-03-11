import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { Store, Product } from "@/types";

// cache() deduplicates DB calls between generateMetadata and the page render
// within the same request. Each request gets its own cache scope.

export const getStoreBySlug = cache(async (storeSlug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();
  return data as Store | null;
});

export const getActiveStoreProducts = cache(async (storeId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("created_at", { ascending: false });
  return (data as Product[] | null) ?? [];
});

export const getProductBySlug = cache(
  async (storeId: string, productSlug: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("slug", productSlug)
      .single();
    return data as Product | null;
  },
);
