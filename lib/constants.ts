const FREE_MAX_IMAGE_SIZE_MB = 5;

export const PLAN = {
  FREE: {
    PRODUCT_LIMIT: 5,
    MAX_IMAGE_SIZE_MB: FREE_MAX_IMAGE_SIZE_MB,
    MAX_IMAGE_SIZE_BYTES: FREE_MAX_IMAGE_SIZE_MB * 1024 * 1024,
  },
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const VALIDATION = {
  STORE_NAME_MAX: 100,
  PRODUCT_NAME_MAX: 200,
  BIO_MAX: 500,
  DESCRIPTION_MAX: 1000,
  WHATSAPP_MIN: 10,
  WHATSAPP_MAX: 15,
  SLUG_MAX: 50,
  HEX_COLOR_REGEX: /^#[0-9A-Fa-f]{6}$/,
} as const;
