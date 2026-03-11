"use client";

import { trackEvent } from "@/lib/actions/analytics";
import { MessageCircle } from "lucide-react";

interface Props {
  whatsappUrl: string;
  storeId: string;
}

export default function WhatsAppBuyButton({ whatsappUrl, storeId }: Props) {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(storeId, "whatsapp_click")}
      className="flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-2xl text-lg hover:opacity-90 transition-all whatsapp-pulse"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="w-5 h-5" />
      Comprar pelo WhatsApp
    </a>
  );
}
