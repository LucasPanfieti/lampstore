"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const FREE_PLAN_LIMIT = 5;

export async function createProduct(storeId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  // Check product limit
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId);

  if ((count ?? 0) >= FREE_PLAN_LIMIT) {
    return {
      error: `Você atingiu o limite de ${FREE_PLAN_LIMIT} produtos do plano gratuito. Faça upgrade para adicionar mais.`,
    };
  }

  const name = formData.get("name") as string;
  const slug = slugify(name);
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  let image_url: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${storeId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    image_url = urlData.publicUrl;
  }

  // Handle duplicate slugs
  let finalSlug = slug;
  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("store_id", storeId)
    .eq("slug", slug);

  if (existing && existing.length > 0) {
    finalSlug = `${slug}-${Date.now()}`;
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ store_id: storeId, name, slug: finalSlug, price, description, image_url })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { data };
}

export async function updateProduct(productId: string, storeId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  let image_url: string | undefined = undefined;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${storeId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    image_url = urlData.publicUrl;
  }

  const updateData: Record<string, unknown> = { name, price, description };
  if (image_url) updateData.image_url = image_url;

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { data };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function getStoreProducts(storeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}
