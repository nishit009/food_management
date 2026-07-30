import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import kumbhakarna from "../assets/gat.gif";
import feast from "../assets/backdrop.png";

const floaters = [
  { emoji: "🍛", top: "18%", left: "8%", delay: "0s" },
  { emoji: "🥘", top: "62%", left: "4%", delay: "1.4s" },
  { emoji: "🍮", top: "26%", left: "88%", delay: "0.8s" },
  { emoji: "🫓", top: "70%", left: "84%", delay: "2.1s" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-secondary bg-[image:var(--gradient-dusk)]">
      {/* parallax stone temple backdrop */}
      <div
        aria-hidden
        className="stone-wash pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(to bottom, oklch(0.983 0.014 91 / 0.52), oklch(0.983 0.014 91 / 0.74)), url(${feast})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      />
      {/* drifting clouds */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 h-32">
        <div className="animate-drift absolute h-20 w-56 rounded-full bg-card/70 blur-2xl" />
        <div
          className="animate-drift absolute top-14 h-14 w-40 rounded-full bg-card/60 blur-2xl"
          style={{ animationDuration: "90s", animationDelay: "-30s" }}
        />
      </div>

      {floaters.map((f) => (
        <span
          key={f.emoji}
          aria-hidden
          className="animate-float-soft pointer-events-none absolute hidden text-4xl drop-shadow sm:block"
          style={{ top: f.top, left: f.left, animationDelay: f.delay }}
        >
          {f.emoji}
        </span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <span className="inline-block rounded-full border border-secondary bg-card/80 px-4 py-1 text-[11px] tracking-[0.3em] text-primary uppercase">
            Chennai · Est. 1999
          </span> */}
          <h1 className="mt-5 font-display text-4xl leading-tight text-primary sm:text-6xl">
            Sree Pavan Caterers
          </h1>
          {/* <p className="mt-4 max-w-md text-base text-foreground/80 sm:text-lg">
            Traditional Taste. Royal Experience. Feasts fit for a giant appetite — cooked on wood
            fire, served on banana leaf.
          </p> */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-md border-2 border-secondary bg-primary px-7 py-3 font-display text-lg text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
            >
              View Menu
              <ChevronRight className="h-5 w-5 text-secondary" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto max-w-sm"
        >
          {/* steam puffs */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="animate-steam absolute bottom-24 h-8 w-8 rounded-full bg-card/70 blur-md"
              style={{ left: `${32 + i * 16}%`, animationDelay: `${i * 1.2}s` }}
            />
          ))}
          <img
            src={kumbhakarna}
            alt="Kumbhakarna, the mascot of Sree Ram Catering, holding a golden mace"
            className="animate-idle relative w-full drop-shadow-[0_20px_30px_rgba(58,36,20,0.35)]"
          />
          {/* <video src={kumbhakarna}/> */}
          <div aria-hidden className="mx-auto h-4 w-2/3 rounded-full bg-bark/25 blur-md" />
        </motion.div>
      </div>
    </section>
  );
}
