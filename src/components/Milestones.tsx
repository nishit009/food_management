import { motion } from "motion/react";
import { useCountUp } from "@/hooks/use-count-up";
import { milestones } from "@/data/site";

function Counter({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, value: current } = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="panel-carved rounded-lg px-6 py-8 text-center"
    >
      <span ref={ref} className="block font-display text-4xl text-primary sm:text-5xl">
        {current.toLocaleString("en-IN")}
        {suffix}
      </span>
      <span className="mt-2 block text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export function Milestones() {
  return (
    <section className="stone-wash border-y-2 border-secondary/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl text-primary sm:text-4xl">Feasts Behind Us</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
          Three decades of copper vessels, banana leaves and very happy guests.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <Counter key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
