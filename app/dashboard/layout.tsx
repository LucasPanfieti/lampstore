import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Store } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar store={store} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 min-w-0 overflow-hidden">
        <DashboardHeader user={user} store={store} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
