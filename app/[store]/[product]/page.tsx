import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { insertAnalyticsEvent } from "@/lib/actions/analytics";
import {
  formatCurrency,
  buildWhatsAppUrl,
  buildSingleProductMessage,
} from "@/lib/utils";
import { ArrowLeft, Package, ExternalLink } from "lucide-react";
import WhatsAppBuyButton from "@/components/store/WhatsAppBuyButton";
import { getStoreBySlug, getProductBySlug } from "@/lib/queries/store";

interface Props {
  params: Promise<{ store: string; product: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store: storeSlug, product: productSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) return { title: "Produto não encontrado" };

  const product = await getProductBySlug(store.id, productSlug);

  if (!product) return { title: "Produto não encontrado" };

  return {
    title: `${product.name} — ${store.name}`,
    description:
      product.description ??
      `${product.name} por ${formatCurrency(product.price)}`,
    openGraph: {
      title: product.name,
      description:
        product.description ??
        `${product.name} por ${formatCurrency(product.price)}`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { store: storeSlug, product: productSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) notFound();

  const product = await getProductBySlug(store.id, productSlug);

  if (!product) notFound();

  // Create the client before after() — cookies() is not available inside it
  const supabase = await createClient();
  after(() =>
    insertAnalyticsEvent(supabase, store.id, "product_view", {
      product_id: product.id,
    }),
  );

  const themeColor = store.theme_color || "#7723A4";

  const whatsappUrl = store.whatsapp
    ? buildWhatsAppUrl(
        store.whatsapp,
        buildSingleProductMessage(product.name, store.name),
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href={`/${store.slug}`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{store.name}</span>
          </Link>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* Image */}
          <div className="relative h-72 sm:h-96 bg-gray-50">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="w-20 h-20 text-gray-200" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {product.name}
              </h1>
              <div
                className="text-3xl font-bold mt-3"
                style={{ color: themeColor }}
              >
                {formatCurrency(product.price)}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                  Descrição
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {whatsappUrl ? (
                <WhatsAppBuyButton
                  whatsappUrl={whatsappUrl}
                  storeId={store.id}
                />
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Esta loja ainda não configurou o WhatsApp
                </div>
              )}

              <Link
                href={`/${store.slug}`}
                className="flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-2xl border-2 text-sm transition-all hover:bg-gray-50"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                Ver mais produtos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer branding */}
      <footer className="py-2 bg-white border-t border-gray-100 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Image
            src="/logo_lampstore.webp"
            alt="LampStore"
            width={36}
            height={36}
            className="rounded"
          />
          Crie sua loja grátis no{" "}
          <span
            style={{
              fontFamily: "var(--font-nunito), sans-serif",
              fontWeight: 800,
            }}
          >
            <span style={{ color: "#1e1b4b" }}>Lamp</span>
            <span style={{ color: "#7723A4" }}>Store</span>
          </span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
