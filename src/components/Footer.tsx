import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { contact } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t-4 border-secondary bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="brass-rule mb-10" />
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-2xl text-secondary">Sree Ram Catering</h3>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
              Traditional taste, royal experience. Serving South India's celebrations with
              hand-ground spices and fire-cooked feasts.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={contact.instagram}
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-secondary/70 transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-secondary/70 transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={contact.facebook}
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-secondary/70 transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg text-secondary">Reach Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg text-secondary">Serving Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
              <li>Kitchen open daily · 5 AM – 11 PM</li>
              <li>Orders confirmed 3 days in advance</li>
              <li>Minimum 50 guests</li>
            </ul>
          </div>
        </div>

        <div className="brass-rule mt-10" />
        <p className="mt-6 text-center text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} Sree Ram Catering. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
