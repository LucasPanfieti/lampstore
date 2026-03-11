import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/dashboard/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Store } from "@/types";

export default async function NewProductPage() {
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

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store!.id);

  if ((count ?? 0) >= 5) {
    redirect("/dashboard/products");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard/products"
          className="p-2 rounded-xl hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Novo produto
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Adicione um produto ao seu catálogo
          </p>
        </div>
      </div>

      <ProductForm storeId={store.id} />
    </div>
  );
}
