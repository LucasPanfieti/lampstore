import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Eye, MessageCircle, Package, TrendingUp } from "lucide-react";
import { Store } from "@/types";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: storeData } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const store = storeData as Store | null;

  if (!store) redirect("/dashboard");

  // Get analytics last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: analyticsData } = await supabase
    .from("analytics")
    .select("event_type, created_at")
    .eq("store_id", store!.id)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false });
  const analytics = analyticsData as
    | { event_type: string; created_at: string }[]
    | null;

  const storeViews =
    analytics?.filter((e) => e.event_type === "store_view").length ?? 0;
  const whatsappClicks =
    analytics?.filter((e) => e.event_type === "whatsapp_click").length ?? 0;
  const productViews =
    analytics?.filter((e) => e.event_type === "product_view").length ?? 0;
  const conversionRate =
    storeViews > 0 ? ((whatsappClicks / storeViews) * 100).toFixed(1) : "0.0";

  // Group views by day for the chart data
  const viewsByDay: Record<string, number> = {};
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  last7Days.forEach((day) => (viewsByDay[day] = 0));
  analytics?.forEach((event) => {
    if (event.event_type === "store_view") {
      const day = event.created_at.split("T")[0];
      if (viewsByDay[day] !== undefined) {
        viewsByDay[day]++;
      }
    }
  });

  const maxViews = Math.max(...Object.values(viewsByDay), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">Dados dos últimos 30 dias</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Visitas à loja",
            value: storeViews,
            icon: Eye,
            color: "blue",
          },
          {
            label: "Cliques WhatsApp",
            value: whatsappClicks,
            icon: MessageCircle,
            color: "green",
          },
          {
            label: "Views de produto",
            value: productViews,
            icon: Package,
            color: "purple",
          },
          {
            label: "Taxa de conversão",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: "orange",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          const colorMap = {
            blue: "bg-blue-50 text-blue-500",
            green: "bg-green-50 text-green-500",
            purple: "bg-purple-50 text-purple-500",
            orange: "bg-orange-50 text-orange-500",
          };
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color as keyof typeof colorMap]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">
          Visitas nos últimos 7 dias
        </h3>
        <div className="flex items-end gap-2 h-40">
          {last7Days.map((day) => {
            const views = viewsByDay[day];
            const height = maxViews > 0 ? (views / maxViews) * 100 : 0;
            const date = new Date(day + "T12:00:00");
            const label = date.toLocaleDateString("pt-BR", {
              weekday: "short",
            });

            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: "120px" }}
                >
                  <div
                    className="w-full bg-orange-500 rounded-t-lg transition-all min-h-[4px]"
                    style={{ height: `${Math.max(height, 3)}%` }}
                    title={`${views} visitas`}
                  />
                </div>
                <span className="text-xs text-gray-400 capitalize">
                  {label}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {views}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {storeViews === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center space-y-2">
          <div className="text-3xl">📊</div>
          <h3 className="font-semibold text-amber-900">Ainda sem dados</h3>
          <p className="text-amber-700 text-sm">
            Compartilhe o link da sua loja para começar a ver as visitas aqui.
          </p>
        </div>
      )}
    </div>
  );
}
