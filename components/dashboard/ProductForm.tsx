"use client";

import { useState, useRef } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Product } from "@/types";
import { Loader2, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductFormProps {
  storeId: string;
  product?: Product;
}

export default function ProductForm({ storeId, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = product
      ? await updateProduct(product.id, storeId, formData)
      : await createProduct(storeId, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/products");
        router.refresh();
      }, 800);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6"
    >
      {/* Image upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Foto do produto
        </label>
        <div
          className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-300 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {imagePreview ? (
            <div className="relative h-48 group">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium">
                  Clique para trocar
                </p>
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  Clique para enviar uma foto
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, WEBP até 5MB
                </p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Nome do produto *
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          placeholder="Ex: Camiseta Básica Branca"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Preço (R$) *
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={product?.price}
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="Descreva o produto, tamanhos disponíveis, material, etc."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl border border-green-100">
          ✓ Produto salvo com sucesso!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || success}
        className="w-full bg-purple-500 text-white font-semibold py-3.5 rounded-xl hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {product ? "Salvar alterações" : "Adicionar produto"}
      </button>
    </form>
  );
}
