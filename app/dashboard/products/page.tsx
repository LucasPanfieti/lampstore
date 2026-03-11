import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Package, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import DeleteProductButton from "@/components/dashboard/DeleteProductButton";
import { Store, Product } from "@/types";

export default async function ProductsPage() {
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

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store!.id)
    .order("created_at", { ascending: false });
  const products = productsData as Product[] | null;

  const FREE_LIMIT = 5;
  const productCount = products?.length ?? 0;
  const canAdd = productCount < FREE_LIMIT;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Produtos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {productCount}/{FREE_LIMIT} produtos no plano gratuito
          </p>
        </div>
        {canAdd ? (
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 bg-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo produto
          </Link>
        ) : (
          <div className="flex items-center gap-2 bg-gray-100 text-gray-400 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Limite atingido
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Uso do plano gratuito</span>
          <span className="font-medium text-gray-900">
            {productCount}/{FREE_LIMIT}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(productCount / FREE_LIMIT) * 100}%`,
              backgroundColor:
                productCount >= FREE_LIMIT ? "#ef4444" : "#7723A4",
            }}
          />
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Nenhum produto ainda
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Adicione seu primeiro produto para começar a vender
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar produto
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
            >
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
                    <Package className="w-12 h-12 text-gray-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="p-2 bg-white rounded-xl text-gray-700 hover:text-purple-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {product.name}
                </div>
                <div className="text-lg font-bold text-purple-500">
                  {formatCurrency(product.price)}
                </div>
                {product.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
