"use client";

export default function CopyButtonClient({ text }: { text: string }) {
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
      }}
      className="bg-white text-orange-500 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-all whitespace-nowrap"
    >
      Copiar
    </button>
  );
}
