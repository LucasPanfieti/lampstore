"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, Product, CartItem } from "@/types";
import {
  formatCurrency,
  buildWhatsAppUrl,
  buildCartMessage,
  buildSingleProductMessage,
} from "@/lib/utils";
import { trackEvent } from "@/lib/actions/analytics";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  MessageCircle,
  Package,
  Zap,
  ExternalLink,
} from "lucide-react";

interface StorePageProps {
  store: Store;
  products: Product[];
}

export default function StorePage({ store, products }: StorePageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCartCheckout = () => {
    if (!store.whatsapp || cart.length === 0) return;
    trackEvent(store.id, "whatsapp_click", { source: "cart" });
    const message = buildCartMessage(
      cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      store.name,
    );
    window.open(buildWhatsAppUrl(store.whatsapp, message), "_blank");
  };

  const handleBuyNow = (product: Product) => {
    if (!store.whatsapp) return;
    trackEvent(store.id, "whatsapp_click", { product_id: product.id });
    const message = buildSingleProductMessage(product.name, store.name);
    window.open(buildWhatsAppUrl(store.whatsapp, message), "_blank");
  };

  const themeColor = store.theme_color || "#7723A4";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store header */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}05)`,
          borderBottom: `3px solid ${themeColor}20`,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              {store.name[0].toUpperCase()}
            </div>

            <div className="space-y-2">
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {store.name}
              </h1>
              {store.bio && (
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                  {store.bio}
                </p>
              )}
            </div>

            {store.whatsapp && (
              <a
                href={buildWhatsAppUrl(
                  store.whatsapp,
                  `Olá! Vim do catálogo ${store.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(store.id, "whatsapp_click", { source: "header" })
                }
                className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:opacity-90 transition-all"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package className="w-12 h-12 text-gray-200 mx-auto" />
            <p className="text-gray-400">Nenhum produto disponível ainda</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              {products.length} {products.length === 1 ? "produto" : "produtos"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => {
                const cartItem = cart.find(
                  (item) => item.product.id === product.id,
                );
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <Link href={`/${store.slug}/${product.slug}`}>
                      <div className="relative h-40 bg-gray-50">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-10 h-10 text-gray-200" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-3 space-y-3">
                      <Link href={`/${store.slug}/${product.slug}`}>
                        <div className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2 hover:text-gray-700">
                          {product.name}
                        </div>
                        <div
                          className="text-base font-bold mt-1"
                          style={{ color: themeColor }}
                        >
                          {formatCurrency(product.price)}
                        </div>
                      </Link>

                      {cartItem ? (
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-gray-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-white transition-colors"
                            style={{ backgroundColor: themeColor }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {store.whatsapp && (
                            <button
                              onClick={() => handleBuyNow(product)}
                              className="w-full text-white text-xs font-bold py-2 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 whatsapp-pulse"
                              style={{ backgroundColor: "#25D366" }}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Comprar
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full text-xs font-semibold py-2 rounded-xl border-2 transition-all hover:opacity-80"
                            style={{
                              borderColor: themeColor,
                              color: themeColor,
                            }}
                          >
                            + Carrinho
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 text-white font-bold px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 hover:opacity-90 transition-all"
          style={{ backgroundColor: themeColor }}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <div
              className="absolute -top-2 -right-2 w-5 h-5 bg-white text-xs font-bold rounded-full flex items-center justify-center"
              style={{ color: themeColor }}
            >
              {cartCount}
            </div>
          </div>
          <span>{formatCurrency(cartTotal)}</span>
        </button>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Carrinho ({cartCount})
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-6 h-6 text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p
                      className="text-xs font-bold mt-0.5"
                      style={{ color: themeColor }}
                    >
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              {store.whatsapp ? (
                <button
                  onClick={handleCartCheckout}
                  className="w-full text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar no WhatsApp
                </button>
              ) : (
                <p className="text-center text-sm text-gray-400">
                  Esta loja ainda não configurou o WhatsApp
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer branding */}
      <footer className="py-8 text-center">
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
