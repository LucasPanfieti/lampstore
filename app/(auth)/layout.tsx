import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex flex-col">
      <nav className="p-6">
        <Link href="/" className="flex items-center gap-1 w-fit">
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
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
