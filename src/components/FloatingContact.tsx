import { MessageCircle } from "lucide-react";
import { contact } from "@/data/site";

export function FloatingContact() {
  return (
    <a
      href={`https://wa.me/${contact.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full border-2 border-secondary bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5 text-secondary" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
