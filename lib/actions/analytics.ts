import { createClient, createAnonClient } from "@/lib/supabase/server";
import { Json } from "@/types";

/**
 * Plain server-side helper — uses a cookie-free anon client internally.
 * Safe to call inside `after()` without blocking the render path.
 * Not a Server Action: never import this in Client Components.
 */
export async function insertAnalyticsEvent(
  storeId: string,
  eventType: "store_view" | "whatsapp_click" | "product_view",
  metadata?: Record<string, Json>,
) {
  const supabase = createAnonClient();
  await supabase.from("analytics").insert({
    store_id: storeId,
    event_type: eventType,
    metadata: (metadata ?? null) as Json | null,
  });
}

/** Server Action — serializable args only, safe to call from Client Components. */
export async function trackEvent(
  storeId: string,
  eventType: "store_view" | "whatsapp_click" | "product_view",
  metadata?: Record<string, Json>,
) {
  "use server";
  const supabase = await createClient();
  await insertAnalyticsEvent(supabase, storeId, eventType, metadata);
}

/** Server Action — safe to call from Client Components. */
export async function getStoreAnalytics(storeId: string) {
  "use server";
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
