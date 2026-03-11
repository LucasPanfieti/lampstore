"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { PLAN } from "@/lib/constants";
import {
  validateProductName,
  validatePrice,
  validateImageFile,
} from "@/lib/validations";

// Verifies that storeId belongs to userId
async function assertStoreOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  storeId: string,
) {
  const { data } = await supabase
    .from("stores")
    .select("id")
    .eq("id", storeId)
    .eq("user_id", userId)
    .single();
  return data;
}

// Verifies that productId belongs to a store owned by userId; returns store_id
async function assertProductOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  productId: string,
) {
  // Single round-trip: inner join filters out products whose store doesn't belong to userId
  const { data } = await supabase
    .from("products")
    .select("store_id, stores!inner(id)")
    .eq("id", productId)
    .eq("stores.user_id", userId)
    .single();

  return data ? data.store_id : null;
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storeId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const check = validateImageFile(file);
  if (!check.ok) return { error: check.error };

  // Derive extension exclusively from the validated MIME type — never trust file.name
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const fileExt = mimeToExt[file.type];
  if (!fileExt) {
    return { error: "Não foi possível determinar a extensão da imagem." };
  }

  // crypto.randomUUID() avoids collisions from parallel uploads in the same millisecond
  const fileName = `${storeId}/${crypto.randomUUID()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) return { error: "Erro ao fazer upload da imagem." };

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(uploadData.path);

  return { url: urlData.publicUrl };
}

export async function createProduct(storeId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  // Verify the storeId belongs to the current user
  const store = await assertStoreOwnership(supabase, user.id, storeId);
  if (!store) return { error: "Não autorizado" };

  // Enforce plan limit
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId);

  if ((count ?? 0) >= PLAN.FREE.PRODUCT_LIMIT) {
    return {
      error: `Você atingiu o limite de ${PLAN.FREE.PRODUCT_LIMIT} produtos do plano gratuito. Faça upgrade para adicionar mais.`,
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const priceStr = formData.get("price") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const imageFile = formData.get("image") as File;

  const nameCheck = validateProductName(name);
  if (!nameCheck.ok) return { error: nameCheck.error };

  const priceCheck = validatePrice(priceStr);
  if (!priceCheck.ok) return { error: priceCheck.error };

  const price = parseFloat(priceStr);

  let image_url: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(supabase, storeId, imageFile);
    if ("error" in result) return { error: result.error };
    image_url = result.url;
  }

  const slug = slugify(name);
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
    .insert({
      store_id: storeId,
      name,
      slug: finalSlug,
      price,
      description,
      image_url,
    })
    .select()
    .single();

  if (error) return { error: "Erro ao criar produto." };

  revalidatePath("/dashboard/products");
  return { data };
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  // Verify the product belongs to a store owned by the current user
  const ownedStoreId = await assertProductOwnership(
    supabase,
    user.id,
    productId,
  );
  if (!ownedStoreId) return { error: "Não autorizado" };

  const name = (formData.get("name") as string)?.trim();
  const priceStr = formData.get("price") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const imageFile = formData.get("image") as File;

  const nameCheck = validateProductName(name);
  if (!nameCheck.ok) return { error: nameCheck.error };

  const priceCheck = validatePrice(priceStr);
  if (!priceCheck.ok) return { error: priceCheck.error };

  const price = parseFloat(priceStr);

  let image_url: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(supabase, ownedStoreId, imageFile);
    if ("error" in result) return { error: result.error };
    image_url = result.url;
  }

  const updateData: Record<string, unknown> = { name, price, description };
  if (image_url !== undefined) updateData.image_url = image_url;

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single();

  if (error) return { error: "Erro ao atualizar produto." };

  revalidatePath("/dashboard/products");
  return { data };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  // Verify the product belongs to a store owned by the current user
  const ownedStoreId = await assertProductOwnership(
    supabase,
    user.id,
    productId,
  );
  if (!ownedStoreId) return { error: "Não autorizado" };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { error: "Erro ao excluir produto." };

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
