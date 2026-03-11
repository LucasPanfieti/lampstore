import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
        <Zap className="w-8 h-8 text-orange-500" />
      </div>
      <div className="space-y-2">
        <h1
          className="text-4xl font-bold text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Página não encontrada
        </h1>
        <p className="text-gray-500 max-w-md">
          A loja ou produto que você está procurando não existe ou foi removido.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all"
        >
          Ir para o início
        </Link>
      </div>
    </div>
  );
}
