import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStoreAnalytics } from "@/lib/actions/analytics";
import {
  Eye,
  MessageCircle,
  Package,
  ExternalLink,
  Plus,
  ArrowRight,
} from "lucide-react";
import CreateStoreForm from "@/components/dashboard/CreateStoreForm";
import { Store, Product } from "@/types";
import CopyButtonClient from "@/components/dashboard/CopyButtonClient";

export default async function DashboardPage() {
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

  const { data: productsData } = store
    ? await supabase.from("products").select("*").eq("store_id", store.id)
    : { data: [] };
  const products = productsData as Product[] | null;

  const analytics = store ? await getStoreAnalytics(store.id) : null;

  // If no store yet, show create store form
  if (!store) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center space-y-2 mb-8">
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Crie sua loja ⚡
          </h1>
          <p className="text-gray-500">
            Configure sua loja em menos de 2 minutos e comece a vender.
          </p>
        </div>
        <CreateStoreForm />
      </div>
    );
  }

  const FREE_LIMIT = 5;
  const productCount = products?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Olá! 👋
        </h1>
        <p className="text-gray-500 mt-1">Veja como sua loja está indo</p>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href={`/${store.slug}`}
          target="_blank"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-all">
            <ExternalLink className="w-5 h-5 text-orange-500 group-hover:text-white transition-all" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Ver minha loja</div>
            <div className="text-sm text-gray-400">
              lampstore.com/{store.slug}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-orange-400 transition-all" />
        </Link>

        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-4 bg-orange-500 rounded-2xl p-5 hover:bg-orange-600 transition-all group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">Adicionar produto</div>
            <div className="text-sm text-orange-100">
              {productCount}/{FREE_LIMIT} produtos usados
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/50 ml-auto group-hover:text-white transition-all" />
        </Link>
      </div>

      {/* Analytics */}
      {analytics && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Últimos 30 dias
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Visitas",
                value: analytics.store_views,
                icon: Eye,
                color: "blue",
              },
              {
                label: "Cliques WhatsApp",
                value: analytics.whatsapp_clicks,
                icon: MessageCircle,
                color: "green",
              },
              {
                label: "Produtos",
                value: productCount,
                icon: Package,
                color: "orange",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      stat.color === "blue"
                        ? "bg-blue-50"
                        : stat.color === "green"
                          ? "bg-green-50"
                          : "bg-orange-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        stat.color === "blue"
                          ? "text-blue-500"
                          : stat.color === "green"
                            ? "text-green-500"
                            : "text-orange-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product limit warning */}
      {productCount >= FREE_LIMIT && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <div className="text-2xl">⚠️</div>
          <div>
            <div className="font-semibold text-amber-900">
              Limite do plano gratuito atingido
            </div>
            <div className="text-sm text-amber-700 mt-1">
              Você tem {FREE_LIMIT} produtos (limite do plano gratuito). Em
              breve lançaremos o plano Pro com produtos ilimitados.
            </div>
          </div>
        </div>
      )}

      {/* Share link */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Compartilhe sua loja</h3>
          <p className="text-orange-100 text-sm mt-1">
            Coloque este link na bio do Instagram ou TikTok
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-xl px-4 py-2.5 text-white text-sm font-medium truncate">
            {process.env.NEXT_PUBLIC_APP_URL}/{store.slug}
          </div>
          <CopyButton
            text={`${process.env.NEXT_PUBLIC_APP_URL ?? "https://lampstore.com"}/${store.slug}`}
          />
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return <CopyButtonClient text={text} />;
}
