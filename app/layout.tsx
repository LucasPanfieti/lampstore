import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LampStore — Crie seu catálogo e venda pelo WhatsApp",
  description:
    "Crie seu catálogo online grátis e venda diretamente pelo WhatsApp em minutos. Ideal para influenciadores, criadores de conteúdo e pequenos vendedores.",
  keywords: "catálogo online, vender pelo whatsapp, loja virtual grátis, link para bio",
  openGraph: {
    title: "LampStore — Crie seu catálogo e venda pelo WhatsApp",
    description: "Crie seu catálogo online grátis e venda pelo WhatsApp.",
    type: "website",
    url: "https://lampstore.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
