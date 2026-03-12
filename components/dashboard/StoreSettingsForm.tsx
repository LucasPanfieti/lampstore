"use client";

import { useState } from "react";
import { updateStore } from "@/lib/actions/stores";
import { Store } from "@/types";
import { validateStoreName } from "@/lib/validations";
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

const BR_DDDS = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19", // SP
  "21",
  "22",
  "24", // RJ
  "27",
  "28", // ES
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38", // MG
  "41",
  "42",
  "43",
  "44",
  "45",
  "46", // PR
  "47",
  "48",
  "49", // SC
  "51",
  "53",
  "54",
  "55", // RS
  "61", // DF
  "62",
  "64", // GO
  "63", // TO
  "65",
  "66", // MT
  "67", // MS
  "68", // AC
  "69", // RO
  "71",
  "73",
  "74",
  "75",
  "77", // BA
  "79", // SE
  "81",
  "87", // PE
  "82", // AL
  "83", // PB
  "84", // RN
  "85",
  "88", // CE
  "86",
  "89", // PI
  "91",
  "93",
  "94", // PA
  "92",
  "97", // AM
  "95", // RR
  "96", // AP
  "98",
  "99", // MA
];

// Formats the number part (after DDD) with mask: 99999-9999 or 9999-9999
function formatNumberPart(digits: string): string {
  const splitAt = digits[0] === "9" ? 5 : 4;
  if (digits.length <= splitAt) return digits;
  return `${digits.slice(0, splitAt)}-${digits.slice(splitAt, splitAt + 4)}`;
}

function parseStoredPhone(whatsapp: string | null | undefined): {
  ddd: string;
  number: string;
} {
  if (!whatsapp) return { ddd: "", number: "" };
  const digits = whatsapp.replace(/\D/g, "");
  // Strip leading country code "55" if present
  const local =
    digits.startsWith("55") && digits.length > 2 ? digits.slice(2) : digits;
  return { ddd: local.slice(0, 2), number: local.slice(2) };
}

export default function StoreSettingsForm({ store }: { store: Store }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [storeName, setStoreName] = useState(store.name);
  const storeNameValidation = validateStoreName(storeName);
  const storeNameError =
    storeName !== store.name || storeName.trim() === ""
      ? !storeNameValidation.ok
        ? storeNameValidation.error
        : null
      : null;
  const [themeColor, setThemeColor] = useState(store.theme_color);
  const [buttonColor, setButtonColor] = useState(store.button_color);
  const [copied, setCopied] = useState(false);
  const [ddd, setDdd] = useState(() => parseStoredPhone(store.whatsapp).ddd);
  const [phoneNumber, setPhoneNumber] = useState(
    () => parseStoredPhone(store.whatsapp).number,
  );

  const numberDisplay = formatNumberPart(phoneNumber);
  // full digits for the hidden field
  const allDigits = `${ddd}${phoneNumber}`;
  // warn if the user filled one side but not the other
  const whatsappPartial =
    (ddd !== "" && phoneNumber.length < 8) ||
    (ddd === "" && phoneNumber.length > 0);

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhoneNumber(digits);
  }

  const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://lampstore.com"}/${store.slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(formData: FormData) {
    if (!storeNameValidation.ok) {
      setError(storeNameValidation.error);
      return;
    }
    if (whatsappPartial) {
      setError(
        "Preencha o DDD e o número completo do WhatsApp, ou deixe os dois campos em branco.",
      );
      return;
    }
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
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              storeNameError ? "border-red-400" : "border-gray-200"
            }`}
          />
          {storeNameError && (
            <p className="text-xs text-red-500">{storeNameError}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            WhatsApp
          </label>
          <div className="flex">
            <span className="flex items-center px-3 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-medium text-gray-500 select-none whitespace-nowrap">
              🇧🇷 +55
            </span>
            <select
              value={ddd}
              onChange={(e) => setDdd(e.target.value)}
              className={`px-2 py-3 bg-white border-y text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset cursor-pointer ${
                whatsappPartial ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="">DDD</option>
              {BR_DDDS.map((d) => (
                <option key={d} value={d}>
                  ({d})
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="tel"
              value={numberDisplay}
              onChange={handleNumberChange}
              placeholder="99999-9999"
              className={`flex-1 px-4 py-3 border border-l-0 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0 ${
                whatsappPartial ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          {whatsappPartial && (
            <p className="text-xs text-red-500">
              Preencha o DDD e o número completo, ou deixe ambos em branco.
            </p>
          )}
          {/* Send clean digits to the server — validation strips non-digits already */}
          <input
            type="hidden"
            name="whatsapp"
            value={allDigits.length >= 10 ? `55${allDigits}` : ""}
          />
          <p className="text-xs text-gray-400">
            Celular: 99999-9999 · Fixo: 9999-9999
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
