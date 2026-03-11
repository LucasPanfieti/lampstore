"use client";

import { useState } from "react";
import { createStore } from "@/lib/actions/stores";
import { slugify } from "@/lib/utils";
import { Loader2, Store, AtSign, Phone, FileText, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

const THEME_COLORS = [
  "#f97316", "#ef4444", "#8b5cf6", "#3b82f6", "#10b981",
  "#f59e0b", "#ec4899", "#06b6d4", "#84cc16", "#6366f1",
];

export default function CreateStoreForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [themeColor, setThemeColor] = useState("#f97316");
  const router = useRouter();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createStore(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-400" />
          Nome da loja *
        </label>
        <input
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ex: Loja da Ana"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <AtSign className="w-4 h-4 text-gray-400" />
          Link da loja *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 whitespace-nowrap">
            lampstore.com/
          </span>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="minhaloja"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        {slug && (
          <p className="text-xs text-green-600 font-medium">
            ✓ lampstore.com/{slug}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          WhatsApp (com DDD)
        </label>
        <input
          name="whatsapp"
          type="text"
          placeholder="5511999999999"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400">Ex: 5511999999999 (sem espaços ou hífens)</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          Descrição da loja
        </label>
        <textarea
          name="bio"
          rows={3}
          placeholder="Conte sobre sua loja e o que você vende..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-400" />
          Cor do tema
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
                boxShadow: themeColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : "none",
              }}
            />
          ))}
        </div>
        <input type="hidden" name="theme_color" value={themeColor} />
        <input type="hidden" name="button_color" value={themeColor} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        Criar minha loja ⚡
      </button>
    </form>
  );
}
