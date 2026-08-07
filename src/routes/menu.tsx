import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Minus, Plus, Trash2, X } from "lucide-react";
import { menuPackages } from "@/data/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Build Your Menu — Sree Ram Catering" },
      {
        name: "description",
        content:
          "Choose Prasadam, Breakfast, Silver, Gold or a custom spread. Pick dishes, set quantities and request a price quote from Sree Ram Catering.",
      },
      { property: "og:title", content: "Build Your Feast — Sree Ram Catering" },
      {
        property: "og:description",
        content: "Interactive menu builder for weddings, temple events and festivals.",
      },
    ],
  }),
  component: MenuPage,
});

type Selection = Record<string, { name: string; category: string; qty: number }>;

function MenuPage() {
  const [packageId, setPackageId] = useState(menuPackages[2].id);
  const [selected, setSelected] = useState<Selection>({});
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const pack = useMemo(
    () => menuPackages.find((p) => p.id === packageId)!,
    [packageId],
  );

  const entries = Object.entries(selected);
  // const totalItems = entries.reduce((sum, [, v]) => sum + v.qty, 0);

  const toggleItem = (id: string, name: string, category: string) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { name, category, qty: 1 };
      return next;
    });


  const switchPackage = (id: string) => {
    setPackageId(id);
    setSelected({});
    setOpenCats([]);
  };

  const grouped = entries.reduce<Record<string, { id: string; name: string; qty: number }[]>>(
    (acc, [id, v]) => {
      (acc[v.category] ??= []).push({ id, name: v.name, qty: v.qty });
      return acc;
    },
    {},
  );

  return (
    <div className="stone-wash min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header className="text-center">
          <h1 className="text-3xl text-primary sm:text-4xl">Build Your Feast</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a menu, choose your dishes, and we'll send the pricing your way.
          </p>
          <div className="brass-rule mx-auto mt-5 w-40" />
        </header>

        {/* Package cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {menuPackages.map((p) => {
            const active = p.id === packageId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => switchPackage(p.id)}
                className={`rounded-lg border-2 p-5 text-left transition-all ${
                  active
                    ? "border-secondary bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                    : "panel-carved hover:-translate-y-1"
                }`}
              >
                <span className="block font-display text-lg">{p.name}</span>
                <span
                  className={`mt-2 block text-xs leading-relaxed ${
                    active ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {p.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Left: selection */}
          <div className="panel-carved rounded-lg p-5">
            <h2 className="text-xl text-primary">{pack.name}</h2>
            <div className="mt-4 space-y-3">
              {pack.categories.map((cat) => {
                const open = openCats.includes(cat.id);
                const count = cat.items.filter((i) => selected[i.id]).length;
                return (
                  <div key={cat.id} className="rounded-md border border-border bg-background/60">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCats((prev) =>
                          prev.includes(cat.id)
                            ? prev.filter((c) => c !== cat.id)
                            : [...prev, cat.id],
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="min-w-0 truncate font-display text-base text-primary">
                        {cat.name}
                        {count > 0 && (
                          <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                            {count}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          {cat.items.map((item) => {
                            const sel = selected[item.id];
                            return (
                              <li
                                key={item.id}
                                className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-2.5"
                              >
                                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(sel)}
                                    onChange={() => toggleItem(item.id, item.name, cat.name)}
                                    className="h-4 w-4 shrink-0 accent-[var(--crimson)]"
                                  />
                                  <span className="truncate text-sm">{item.name}</span>
                                </label>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: live panel */}
          <aside className="panel-carved h-fit rounded-lg p-5 lg:sticky lg:top-24">
            <h2 className="text-xl text-primary">Your Selected Menu</h2>
            {entries.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Nothing chosen yet. Open a category and tick the dishes you'd like served.
              </p>
            ) : (
              <div className="mt-4 space-y-5">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                      {category}
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {items.map((it) => (
                        <li
                          key={it.id}
                          className="flex items-center justify-between gap-2 rounded-md bg-background/70 px-3 py-2"
                        >
                          <span className="min-w-0 flex-1 truncate text-sm">{it.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="brass-rule my-5" />
            <div className="flex items-center justify-between text-sm">
            </div>

            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-5 w-full rounded-md border-2 border-secondary bg-primary px-5 py-3 font-display text-base text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Request Price Quote
              </button>
            )}
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <QuoteModal
            menuName={pack.name}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuoteModal({ menuName, onClose }: { menuName: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-bark/60 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="panel-carved w-full max-w-md rounded-lg p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl text-primary">
            {sent ? "Order Noted" : "Request Price Quote"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <p className="mt-4 text-sm text-foreground/80">
            Thank you! We'll contact you soon with pricing details.
          </p>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <p className="text-xs text-muted-foreground">Menu: {menuName}</p>
            <div>
              <label htmlFor="q-name" className="text-xs tracking-wide text-muted-foreground uppercase">
                Name
              </label>
              <input
                id="q-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label htmlFor="q-phone" className="text-xs tracking-wide text-muted-foreground uppercase">
                Phone Number
              </label>
              <input
                id="q-phone"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-secondary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border-2 border-secondary bg-primary px-5 py-3 font-display text-base text-primary-foreground"
            >
              Send Request
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
