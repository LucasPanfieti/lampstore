import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Share2,
  ChevronRight,
  Check,
  Star,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1">
              <Image
                src="/logo_lampstore.webp"
                alt="LampStore"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span
                className="text-xl"
                style={{
                  fontFamily: "var(--font-nunito), sans-serif",
                  fontWeight: 800,
                }}
              >
                <span style={{ color: "#1e1b4b" }}>Lamp</span>
                <span style={{ color: "#7723A4" }}>Store</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
              >
                Criar loja grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up animation-fill-both">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-sm font-medium px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 fill-purple-500" />
                Grátis para começar
              </div>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Crie seu catálogo e venda pelo{" "}
                <span className="gradient-text">WhatsApp</span> em minutos.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                A plataforma ideal para influenciadores, criadores de conteúdo e
                pequenos vendedores. Compartilhe na bio do Instagram ou TikTok.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-purple-600 transition-all hover:scale-105 shadow-lg shadow-purple-200"
                >
                  Criar minha loja grátis
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 text-gray-700 text-lg font-medium px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all"
                >
                  Como funciona
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  Sem taxa por venda
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  100% grátis
                </div>
              </div>
            </div>

            {/* Mock store preview */}
            <div className="relative animate-fade-up animation-fill-both animate-delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Loja da Ana</div>
                    <div className="text-xs text-gray-400">
                      lampstore.com/lojadaana
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  ✨ Moda feminina premium. Novas coleções toda semana!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Vestido Floral", price: "R$ 159,90", emoji: "👗" },
                    { name: "Bolsa de Couro", price: "R$ 289,90", emoji: "👜" },
                    { name: "Tênis Branco", price: "R$ 199,90", emoji: "👟" },
                    { name: "Colar Dourado", price: "R$ 89,90", emoji: "📿" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="bg-gray-50 rounded-xl p-3 space-y-2"
                    >
                      <div className="w-full h-20 bg-purple-50 rounded-lg flex items-center justify-center text-3xl">
                        {p.emoji}
                      </div>
                      <div className="text-xs font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-xs font-bold text-purple-500">
                        {p.price}
                      </div>
                      <button className="w-full bg-green-500 text-white text-xs font-semibold py-1.5 rounded-lg">
                        WhatsApp
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "10k+", label: "Lojas criadas" },
              { value: "R$2M+", label: "Em vendas geradas" },
              { value: "100%", label: "Grátis para começar" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl sm:text-4xl font-bold text-gray-900"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Como funciona
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Em 3 passos simples você já tem sua loja funcionando
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Zap className="w-6 h-6" />,
                title: "Crie sua conta",
                desc: "Cadastre-se grátis e escolha o nome da sua loja. Seu link já estará pronto na hora.",
              },
              {
                step: "02",
                icon: <ShoppingBag className="w-6 h-6" />,
                title: "Adicione seus produtos",
                desc: "Cadastre seus produtos com foto, nome, descrição e preço. Simples e rápido.",
              },
              {
                step: "03",
                icon: <Share2 className="w-6 h-6" />,
                title: "Compartilhe e venda",
                desc: "Coloque o link na sua bio e comece a vender pelo WhatsApp. Sem complicação.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group"
              >
                <div
                  className="text-6xl font-bold text-gray-50 absolute top-6 right-6 leading-none select-none"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.step}
                </div>
                <div className="relative space-y-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Tudo que você precisa
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🛒",
                title: "Carrinho para WhatsApp",
                desc: "Clientes adicionam vários produtos e enviam tudo de uma vez.",
              },
              {
                icon: "🎨",
                title: "Tema personalizado",
                desc: "Escolha as cores da sua loja para combinar com sua marca.",
              },
              {
                icon: "📊",
                title: "Analytics simples",
                desc: "Veja quantas pessoas visitaram sua loja e clicaram no WhatsApp.",
              },
              {
                icon: "📱",
                title: "Mobile first",
                desc: "Design otimizado para celular, onde seus clientes estão.",
              },
              {
                icon: "🔗",
                title: "Link para bio",
                desc: "Um link perfeito para colocar na bio do Instagram ou TikTok.",
              },
              {
                icon: "⚡",
                title: "Rápido e fácil",
                desc: "Configure em minutos. Sem precisar de técnico ou programador.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all space-y-3"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Quem usa ama
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ana Paula",
                role: "Vendedora de moda",
                text: "Comecei a usar a LampStore e triplicei minhas vendas pelo Instagram. Muito fácil de configurar!",
              },
              {
                name: "Carlos Mendes",
                role: "Artesão",
                text: "Agora coloco o link na minha bio e os clientes já chegam sabendo o preço. Economizo muito tempo.",
              },
              {
                name: "Fernanda Lima",
                role: "Influenciadora",
                text: "Perfeito para quem vende produtos autorais. O design é lindo e funciona no celular.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Planos simples
            </h2>
            <p className="text-xl text-gray-500">
              Comece grátis, cresça quando quiser
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 space-y-6">
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Gratuito
                </div>
                <div
                  className="text-4xl font-bold text-gray-900 mt-2"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  R$ 0
                </div>
                <div className="text-gray-400 text-sm">para sempre</div>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Até 5 produtos",
                  "Página da loja personalizada",
                  "Botão WhatsApp",
                  "Carrinho para WhatsApp",
                  "Analytics básico",
                  "Link para bio",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Começar grátis
              </Link>
            </div>
            <div className="bg-purple-500 rounded-3xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-purple-500 text-xs font-bold px-3 py-1 rounded-full">
                Em breve
              </div>
              <div>
                <div className="text-sm font-semibold text-purple-100 uppercase tracking-wider">
                  Pro
                </div>
                <div
                  className="text-4xl font-bold text-white mt-2"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  R$ 29
                </div>
                <div className="text-purple-200 text-sm">por mês</div>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Produtos ilimitados",
                  "Sem branding LampStore",
                  "Domínio personalizado",
                  "Analytics avançado",
                  "Suporte prioritário",
                  "Múltiplos temas",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-purple-100"
                  >
                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full text-center bg-white/20 text-white font-semibold py-3 rounded-xl cursor-not-allowed"
              >
                Em breve
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Pronto para vender mais?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Junte-se a milhares de vendedores que já usam a LampStore para
            vender pelo WhatsApp.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-purple-500 text-white text-xl font-semibold px-10 py-5 rounded-2xl hover:bg-purple-600 transition-all hover:scale-105 shadow-xl shadow-purple-200"
          >
            Criar minha loja grátis
            <ChevronRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-400">
            Grátis para sempre. Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Image
              src="/logo_lampstore.webp"
              alt="LampStore"
              width={44}
              height={44}
              className="rounded-lg"
            />
            <span
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontWeight: 800,
              }}
            >
              <span style={{ color: "#1e1b4b" }}>Lamp</span>
              <span style={{ color: "#7723A4" }}>Store</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            LampStore © {new Date().getFullYear()} · Todos os direitos
            reservados
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">
              Privacidade
            </Link>
            <Link href="/terms" className="hover:text-gray-600">
              Termos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
