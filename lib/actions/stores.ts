"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { VALIDATION } from "@/lib/constants";
import {
  validateStoreName,
  validateWhatsApp,
  validateHexColor,
} from "@/lib/validations";

export async function createStore(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  const name = (formData.get("name") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const theme_color = (formData.get("theme_color") as string) || "#7723A4";
  const button_color = (formData.get("button_color") as string) || "#7723A4";

  // Validate name before deriving slug to avoid slugify() receiving undefined
  const nameCheck = validateStoreName(name);
  if (!nameCheck.ok) return { error: nameCheck.error };

  const slug = slugify((formData.get("slug") as string) || name);

  const whatsappCheck = validateWhatsApp(whatsapp);
  if (!whatsappCheck.ok) return { error: whatsappCheck.error };

  if (bio && bio.length > VALIDATION.BIO_MAX) {
    return {
      error: `Bio deve ter no máximo ${VALIDATION.BIO_MAX} caracteres.`,
    };
  }

  const themeCheck = validateHexColor(theme_color);
  if (!themeCheck.ok) return { error: `Cor do tema: ${themeCheck.error}` };

  const buttonCheck = validateHexColor(button_color);
  if (!buttonCheck.ok) return { error: `Cor do botão: ${buttonCheck.error}` };

  // Check if slug is taken
  const { data: existing } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { error: "Este nome de loja já está em uso. Tente outro." };
  }

  const { data, error } = await supabase
    .from("stores")
    .insert({
      user_id: user.id,
      name,
      slug,
      whatsapp,
      bio,
      theme_color,
      button_color,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { data };
}

export async function updateStore(storeId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado" };

  const name = (formData.get("name") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const theme_color = (formData.get("theme_color") as string) || "#7723A4";
  const button_color = (formData.get("button_color") as string) || "#7723A4";

  const nameCheck = validateStoreName(name);
  if (!nameCheck.ok) return { error: nameCheck.error };

  const whatsappCheck = validateWhatsApp(whatsapp);
  if (!whatsappCheck.ok) return { error: whatsappCheck.error };

  if (bio && bio.length > VALIDATION.BIO_MAX) {
    return {
      error: `Bio deve ter no máximo ${VALIDATION.BIO_MAX} caracteres.`,
    };
  }

  const themeCheck = validateHexColor(theme_color);
  if (!themeCheck.ok) return { error: `Cor do tema: ${themeCheck.error}` };

  const buttonCheck = validateHexColor(button_color);
  if (!buttonCheck.ok) return { error: `Cor do botão: ${buttonCheck.error}` };

  const { data, error } = await supabase
    .from("stores")
    .update({ name, whatsapp, bio, theme_color, button_color })
    .eq("id", storeId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { data };
}

export async function getMyStore() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}
