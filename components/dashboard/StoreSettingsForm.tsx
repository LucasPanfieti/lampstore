"use client";

import { useState } from "react";
import { updateStore } from "@/lib/actions/stores";
import { Store } from "@/types";
import {
  Loader2,
  Store as StoreIcon,
  Phone,
  FileText,
  Palette,
  Copy,
  Check,
} from "lucide-react";

const THEME_COLORS = [
  "#f97316",
  "#ef4444",
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#6366f1",
];

export default function StoreSettingsForm({ store }: { store: Store }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [themeColor, setThemeColor] = useState(store.theme_color);
  const [buttonColor, setButtonColor] = useState(store.button_color);
  const [copied, setCopied] = useState(false);

  const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://lampstore.com"}/${store.slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateStore(store.id, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Store link */}
      <div className="bg-purple-50 rounded-2xl p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Link da sua loja
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Compartilhe este link na sua bio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium truncate border border-purple-100">
            {storeUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-600 transition-all whitespace-nowrap"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <form
        action={handleSubmit}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-6"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-gray-400" />
            Nome da loja *
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={store.name}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            WhatsApp
          </label>
          <input
            name="whatsapp"
            type="text"
            defaultValue={store.whatsapp ?? ""}
            placeholder="5511999999999"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400">
            Formato: código do país + DDD + número (sem espaços)
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Descrição da loja
          </label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={store.bio ?? ""}
            placeholder="Conte sobre sua loja..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            Cor principal
          </label>
          <div className="flex flex-wrap gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setThemeColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: themeColor === color ? color : "transparent",
                  boxShadow:
                    themeColor === color
                      ? `0 0 0 3px white, 0 0 0 5px ${color}`
                      : "none",
                }}
              />
            ))}
          </div>
          <input type="hidden" name="theme_color" value={themeColor} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Cor do botão WhatsApp
          </label>
          <div className="flex flex-wrap gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setButtonColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: buttonColor === color ? color : "transparent",
                  boxShadow:
                    buttonColor === color
                      ? `0 0 0 3px white, 0 0 0 5px ${color}`
                      : "none",
                }}
              />
            ))}
          </div>
          <input type="hidden" name="button_color" value={buttonColor} />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Preview
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: themeColor }}
            >
              {store.name[0]}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900">
                {store.name}
              </div>
            </div>
            <button
              type="button"
              className="ml-auto text-xs font-bold text-white px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: buttonColor }}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl border border-green-100">
            ✓ Configurações salvas!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 text-white font-semibold py-3.5 rounded-xl hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Salvar configurações
        </button>
      </form>
    </div>
  );
}
