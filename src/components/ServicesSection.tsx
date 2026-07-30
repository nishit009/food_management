import { motion } from "motion/react";
import { services } from "@/data/site";

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <span className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
          What we cook for
        </span>
        <h2 className="mt-3 text-3xl text-primary sm:text-4xl">Our Catering Services</h2>
        <div className="brass-rule mx-auto mt-5 w-40" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="panel-carved group rounded-lg p-7"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-secondary bg-accent/50 text-primary transition-transform group-hover:scale-110">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl text-primary">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
