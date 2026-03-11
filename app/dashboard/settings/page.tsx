import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StoreSettingsForm from "@/components/dashboard/StoreSettingsForm";
import { Store } from "@/types";

export default async function SettingsPage() {
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Configurações
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Personalize as informações e aparência da sua loja
        </p>
      </div>

      <StoreSettingsForm store={store} />
    </div>
  );
}
