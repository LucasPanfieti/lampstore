import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { Store, Product } from "@/types";

// cache() deduplicates DB calls between generateMetadata and the page render
// within the same request. Each request gets its own cache scope.

// PostgREST returns this code when .single() finds no rows.
const PGRST_NOT_FOUND = "PGRST116";

export const getStoreBySlug = cache(async (storeSlug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();
  if (error) {
    if (error.code === PGRST_NOT_FOUND) return null;
    throw new Error(error.message);
  }
  return data as Store;
});

export const getActiveStoreProducts = cache(async (storeId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Product[]) ?? [];
});

export const getProductBySlug = cache(
  async (storeId: string, productSlug: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("slug", productSlug)
      .single();
    if (error) {
      if (error.code === PGRST_NOT_FOUND) return null;
      throw new Error(error.message);
    }
    return data as Product;
  },
);
