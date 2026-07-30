import {
  Cake,
  Building2,
  Flame,
  HeartHandshake,
  Home,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Weddings",
    description: "Grand multi-course banquets served with temple-style hospitality.",
    icon: HeartHandshake,
  },
  {
    title: "Housewarming",
    description: "Auspicious Gruhapravesam spreads, cooked fresh at your new home.",
    icon: Home,
  },
  {
    title: "Birthday Events",
    description: "Playful menus for little ones and elders alike, sweets included.",
    icon: Cake,
  },
  {
    title: "Corporate Catering",
    description: "Punctual bulk service for offices, launches and conferences.",
    icon: Building2,
  },
  {
    title: "Temple Events",
    description: "Pure sattvic prasadam prepared without onion or garlic.",
    icon: Sparkles,
  },
  {
    title: "Festivals",
    description: "Pongal, Deepavali and Navratri feasts for the whole street.",
    icon: Flame,
  },
];

export type Milestone = { label: string; value: number; suffix?: string };

export const milestones: Milestone[] = [
  { label: "Years of Experience", value: 27, suffix: "+" },
  { label: "Total Orders Served", value: 8400, suffix: "+" },
  { label: "Happy Families", value: 5200, suffix: "+" },
  { label: "Events Catered", value: 1960, suffix: "+" },
];

export const contact = {
  phone: "+91 98404 12345",
  whatsapp: "919840412345",
  email: "hello@sreeramcatering.in",
  address: "17, Mada Street, Mylapore, Chennai 600004",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
};
