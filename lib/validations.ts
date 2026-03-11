import { ALLOWED_IMAGE_TYPES, PLAN, VALIDATION } from "./constants";

type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateEmail(email: string): ValidationResult {
  if (!email?.trim()) return { ok: false, error: "Email é obrigatório." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { ok: false, error: "Email inválido." };
  }
  return { ok: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { ok: false, error: "Senha é obrigatória." };
  if (password.length < 6)
    return { ok: false, error: "Senha deve ter no mínimo 6 caracteres." };
  if (password.length > 72) return { ok: false, error: "Senha muito longa." };
  return { ok: true };
}

export function validateStoreName(name: string): ValidationResult {
  if (!name?.trim()) return { ok: false, error: "Nome da loja é obrigatório." };
  if (name.trim().length > VALIDATION.STORE_NAME_MAX) {
    return {
      ok: false,
      error: `Nome deve ter no máximo ${VALIDATION.STORE_NAME_MAX} caracteres.`,
    };
  }
  return { ok: true };
}

export function validateProductName(name: string): ValidationResult {
  if (!name?.trim())
    return { ok: false, error: "Nome do produto é obrigatório." };
  if (name.trim().length > VALIDATION.PRODUCT_NAME_MAX) {
    return {
      ok: false,
      error: `Nome deve ter no máximo ${VALIDATION.PRODUCT_NAME_MAX} caracteres.`,
    };
  }
  return { ok: true };
}

export function validatePrice(priceStr: string): ValidationResult {
  const trimmed = priceStr?.trim();
  // Reject partial numeric strings like "10abc" that parseFloat would silently accept
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: "Preço inválido." };
  }
  const price = Number(trimmed);
  if (isNaN(price) || price < 0) return { ok: false, error: "Preço inválido." };
  if (price > 999999.99) return { ok: false, error: "Preço muito alto." };
  return { ok: true };
}

export function validateWhatsApp(phone: string): ValidationResult {
  if (!phone) return { ok: true }; // optional field
  const digits = phone.replace(/\D/g, "");
  if (
    digits.length < VALIDATION.WHATSAPP_MIN ||
    digits.length > VALIDATION.WHATSAPP_MAX
  ) {
    return {
      ok: false,
      error: `WhatsApp inválido. Use apenas números com DDD e código do país (${VALIDATION.WHATSAPP_MIN}–${VALIDATION.WHATSAPP_MAX} dígitos).`,
    };
  }
  return { ok: true };
}

export function validateHexColor(color: string): ValidationResult {
  if (!color) return { ok: true }; // optional
  if (!VALIDATION.HEX_COLOR_REGEX.test(color)) {
    return {
      ok: false,
      error: "Cor inválida. Use formato hexadecimal (#RRGGBB).",
    };
  }
  return { ok: true };
}

export function validateImageFile(file: File): ValidationResult {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return {
      ok: false,
      error: "Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.",
    };
  }
  if (file.size > PLAN.FREE.MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: `A imagem deve ter no máximo ${PLAN.FREE.MAX_IMAGE_SIZE_MB}MB.`,
    };
  }
  return { ok: true };
}
