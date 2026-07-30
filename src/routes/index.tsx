import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { Milestones } from "@/components/Milestones";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sree Ram Catering — Traditional South Indian Feast Catering" },
      {
        name: "description",
        content:
          "Wedding, temple and festival catering in Chennai since 1999. Wood-fired South Indian feasts served on banana leaf. Build your menu and request a quote.",
      },
      { property: "og:title", content: "Sree Ram Catering — Traditional South Indian Feast Catering" },
      {
        property: "og:description",
        content:
          "Wedding, temple and festival catering in Chennai since 1999. Wood-fired South Indian feasts served on banana leaf. Build your menu and request a quote.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <Milestones />
    </>
  );
}
