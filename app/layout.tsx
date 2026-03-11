import type { Metadata } from "next";
import { Sora, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LampStore — Crie seu catálogo e venda pelo WhatsApp",
  description:
    "Crie seu catálogo online grátis e venda diretamente pelo WhatsApp em minutos. Ideal para influenciadores, criadores de conteúdo e pequenos vendedores.",
  keywords:
    "catálogo online, vender pelo whatsapp, loja virtual grátis, link para bio",
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
    <html
      lang="pt-BR"
      className={`${sora.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
