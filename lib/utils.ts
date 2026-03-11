import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function buildSingleProductMessage(
  productName: string,
  storeName: string
): string {
  return `Olá, quero comprar o produto *${productName}* que vi no catálogo *${storeName}*.`;
}

export function buildCartMessage(
  items: { name: string; quantity: number; price: number }[],
  storeName: string
): string {
  const productList = items
    .map((item) => `• ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return `Olá! Vim pelo catálogo *${storeName}* e gostaria de comprar:\n\n${productList}\n\n*Total: ${formatCurrency(total)}*`;
}
