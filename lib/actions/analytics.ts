"use server";

import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types";

export async function trackEvent(
  storeId: string,
  eventType: "store_view" | "whatsapp_click" | "product_view",
  metadata?: Record<string, Json>,
) {
  const supabase = await createClient();

  await supabase.from("analytics").insert({
    store_id: storeId,
    event_type: eventType,
    metadata: (metadata ?? null) as Json | null,
  });
}

export async function getStoreAnalytics(storeId: string) {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from("analytics")
    .select("event_type, created_at")
    .eq("store_id", storeId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  if (error) return { store_views: 0, whatsapp_clicks: 0, product_views: 0 };

  const store_views = data.filter((e) => e.event_type === "store_view").length;
  const whatsapp_clicks = data.filter(
    (e) => e.event_type === "whatsapp_click",
  ).length;
  const product_views = data.filter(
    (e) => e.event_type === "product_view",
  ).length;

  return { store_views, whatsapp_clicks, product_views };
}
