"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/actions/products";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
      return;
    }

    setLoading(true);
    await deleteProduct(productId);
    router.refresh();
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleDelete();
      }}
      disabled={loading}
      className={`p-2 rounded-xl transition-colors ${
        confirm
          ? "bg-red-500 text-white"
          : "bg-white text-gray-700 hover:text-red-500"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
