import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Search,
  X,
  Minus,
  Plus,
  Utensils,
} from "lucide-react";
import menuData from "@/data/menu.json";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      {
        title: "Build Your Menu — Sree Ram Catering",
      },
      {
        name: "description",
        content:
          "Build your own catering menu by selecting dishes from our collection.",
      },
      {
        property: "og:title",
        content: "Build Your Menu — Sree Ram Catering",
      },
      {
        property: "og:description",
        content:
          "Create your own catering menu and send your requirements directly to Sree Ram Catering.",
      },
    ],
  }),
  component: MenuPage,
});

type MenuLeaf = string[];

type MenuCategory = {
  [subcategory: string]: string[];
};

type MenuData = {
  [category: string]: MenuLeaf | MenuCategory;
};

type SelectedItem = {
  name: string;
  category: string;
  subcategory?: string;
};

type Selection = Record<string, SelectedItem>;

const data = menuData as MenuData;

function isSubcategoryMenu(value: MenuLeaf | MenuCategory): value is MenuCategory {
  return !Array.isArray(value);
}

function createItemKey(
  category: string,
  subcategory: string | undefined,
  item: string,
) {
  return [category, subcategory, item].filter(Boolean).join("::");
}

function MenuPage() {
  const [selected, setSelected] = useState<Selection>({});
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const categories = Object.entries(data);

  const entries = Object.entries(selected);

  const selectedCount = entries.length;

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const toggleSubcategory = (subcategoryKey: string) => {
    setOpenSubcategories((prev) =>
      prev.includes(subcategoryKey)
        ? prev.filter((item) => item !== subcategoryKey)
        : [...prev, subcategoryKey],
    );
  };

  const toggleItem = (
    item: string,
    category: string,
    subcategory?: string,
  ) => {
    const key = createItemKey(category, subcategory, item);

    setSelected((prev) => {
      const next = { ...prev };

      if (next[key]) {
        delete next[key];
      } else {
        next[key] = {
          name: item,
          category,
          subcategory,
        };
      }

      return next;
    });
  };

  const groupedSelection = useMemo(() => {
    const grouped: Record<
      string,
      Record<string, SelectedItem[]>
    > = {};

    entries.forEach(([, item]) => {
      if (!grouped[item.category]) {
        grouped[item.category] = {};
      }

      const group = item.subcategory || "__items";

      if (!grouped[item.category][group]) {
        grouped[item.category][group] = [];
      }

      grouped[item.category][group].push(item);
    });

    return grouped;
  }, [selected]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories
      .map(([category, value]) => {
        if (Array.isArray(value)) {
          const filtered = value.filter((item) =>
            item.toLowerCase().includes(query),
          );

          return [category, filtered] as [string, MenuLeaf];
        }

        const filteredSubcategories: MenuCategory = {};

        Object.entries(value).forEach(([subcategory, items]) => {
          const filteredItems = items.filter((item) =>
            item.toLowerCase().includes(query),
          );

          if (filteredItems.length > 0) {
            filteredSubcategories[subcategory] = filteredItems;
          }
        });

        return [category, filteredSubcategories] as [string, MenuCategory];
      })
      .filter(([, value]) =>
        Array.isArray(value)
          ? value.length > 0
          : Object.keys(value).length > 0,
      );
  }, [categories, search]);

  return (
    <div className="stone-wash min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Sree Ram Catering
          </p>

          <h1 className="mt-2 text-3xl text-primary sm:text-4xl">
            Build Your Menu
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Create your own catering menu by choosing exactly the dishes you
            want. Mix and match freely across every category.
          </p>

          <div className="brass-rule mx-auto mt-5 w-40" />
        </header>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full rounded-lg border border-border bg-background/80 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-secondary"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main builder */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Left */}
          <main className="panel-carved rounded-lg p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl text-primary">Choose Your Dishes</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select as many dishes as you need.
                </p>
              </div>

              <div className="hidden shrink-0 rounded-full border border-secondary/50 px-3 py-1 text-xs sm:block">
                {selectedCount} selected
              </div>
            </div>

            <div className="space-y-3">
              {filteredCategories.map(([category, value]) => {
                const categorySelected = entries.filter(
                  ([, item]) => item.category === category,
                ).length;

                const open = openCategories.includes(category);

                return (
                  <div
                    key={category}
                    className="overflow-hidden rounded-md border border-border bg-background/60"
                  >
                    {/* Category */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-background"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10">
                          <Utensils className="h-4 w-4 text-primary" />
                        </span>

                        <span>
                          <span className="block font-display text-base text-primary">
                            {category}
                          </span>

                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {Array.isArray(value)
                              ? `${value.length} dishes`
                              : `${Object.values(value).flat().length} dishes`}
                          </span>
                        </span>

                        {categorySelected > 0 && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                            {categorySelected}
                          </span>
                        )}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/70 p-3">
                            {Array.isArray(value) ? (
                              <DishList
                                items={value}
                                category={category}
                                selected={selected}
                                onToggle={toggleItem}
                              />
                            ) : (
                              <div className="space-y-3">
                                {Object.entries(value).map(
                                  ([subcategory, items]) => {
                                    const subcategoryKey = `${category}::${subcategory}`;
                                    const subOpen =
                                      openSubcategories.includes(
                                        subcategoryKey,
                                      );

                                    const subSelected = entries.filter(
                                      ([, item]) =>
                                        item.category === category &&
                                        item.subcategory === subcategory,
                                    ).length;

                                    return (
                                      <div
                                        key={subcategory}
                                        className="rounded-md border border-border/70"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleSubcategory(subcategoryKey)
                                          }
                                          className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                                        >
                                          <span className="flex items-center gap-2">
                                            <span className="font-display text-sm text-primary">
                                              {subcategory}
                                            </span>

                                            {subSelected > 0 && (
                                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                                                {subSelected}
                                              </span>
                                            )}
                                          </span>

                                          <ChevronDown
                                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                              subOpen ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {subOpen && (
                                            <motion.div
                                              initial={{
                                                height: 0,
                                                opacity: 0,
                                              }}
                                              animate={{
                                                height: "auto",
                                                opacity: 1,
                                              }}
                                              exit={{
                                                height: 0,
                                                opacity: 0,
                                              }}
                                              transition={{
                                                duration: 0.18,
                                              }}
                                              className="overflow-hidden"
                                            >
                                              <DishList
                                                items={items}
                                                category={category}
                                                subcategory={subcategory}
                                                selected={selected}
                                                onToggle={toggleItem}
                                              />
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Right: Selected menu */}
          <aside className="panel-carved h-fit rounded-lg p-5 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl text-primary">Your Menu</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your selections appear here.
                </p>
              </div>

              <span className="rounded-full border border-secondary/50 px-3 py-1 text-xs">
                {selectedCount}
              </span>
            </div>

            {selectedCount === 0 ? (
              <div className="mt-8 rounded-md border border-dashed border-border p-6 text-center">
                <Utensils className="mx-auto h-7 w-7 text-muted-foreground" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Your menu is empty.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Open a category and select the dishes you want.
                </p>
              </div>
            ) : (
              <div className="mt-5 max-h-[55vh] space-y-5 overflow-y-auto pr-1">
                {Object.entries(groupedSelection).map(
                  ([category, subcategories]) => (
                    <div key={category}>
                      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {category}
                      </h3>

                      <div className="mt-2 space-y-2">
                        {Object.entries(subcategories).map(
                          ([subcategory, items]) => (
                            <div key={subcategory}>
                              {subcategory !== "__items" && (
                                <p className="mb-1 mt-3 text-[11px] text-muted-foreground">
                                  {subcategory}
                                </p>
                              )}

                              <div className="space-y-1.5">
                                {items.map((item) => {
                                  const key = createItemKey(
                                    item.category,
                                    item.subcategory,
                                    item.name,
                                  );

                                  return (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between gap-2 rounded-md bg-background/70 px-3 py-2"
                                    >
                                      <span className="min-w-0 flex-1 truncate text-sm">
                                        {item.name}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleItem(
                                            item.name,
                                            item.category,
                                            item.subcategory,
                                          )
                                        }
                                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                        aria-label={`Remove ${item.name}`}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {selectedCount > 0 && (
              <>
                <div className="brass-rule my-5" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total dishes
                  </span>

                  <span className="font-medium text-primary">
                    {selectedCount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-5 w-full rounded-md border-2 border-secondary bg-primary px-5 py-3 font-display text-base text-primary-foreground transition-transform hover:scale-[1.01]"
                >
                  Send Catering Request
                </button>
              </>
            )}
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <QuoteModal
            selected={selected}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DishList({
  items,
  category,
  subcategory,
  selected,
  onToggle,
}: {
  items: string[];
  category: string;
  subcategory?: string;
  selected: Selection;
  onToggle: (
    item: string,
    category: string,
    subcategory?: string,
  ) => void;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-2">
      {items.map((item) => {
        const key = createItemKey(category, subcategory, item);
        const isSelected = Boolean(selected[key]);

        return (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition ${
              isSelected
                ? "bg-primary/10"
                : "hover:bg-background"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() =>
                onToggle(item, category, subcategory)
              }
              className="h-4 w-4 shrink-0 accent-[var(--crimson)]"
            />

            <span
              className={`min-w-0 flex-1 text-sm ${
                isSelected ? "font-medium text-primary" : ""
              }`}
            >
              {item}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function QuoteModal({
  selected,
  onClose,
}: {
  selected: Selection;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const selectedItems = Object.values(selected);

  const createMessage = () => {
    const menu = selectedItems
      .map((item) => {
        const location = item.subcategory
          ? `${item.category} → ${item.subcategory}`
          : item.category;

        return `• ${item.name} (${location})`;
      })
      .join("\n");

    return [
      "CATERING MENU REQUEST",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Event Date: ${eventDate}`,
      `Guests: ${guests}`,
      `Location: ${location}`,
      "",
      "SELECTED MENU:",
      menu,
      "",
      `Additional Requirements: ${notes || "None"}`,
    ].join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /*
     * Replace this with your actual backend / WhatsApp / email
     * submission later.
     *
     * Example:
     * const message = createMessage();
     * window.open(
     *   `https://wa.me/YOUR_NUMBER?text=${encodeURIComponent(message)}`,
     *   "_blank"
     * );
     */

    console.log(createMessage());

    setSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-bark/60 px-4 py-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="panel-carved w-full max-w-lg rounded-lg p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl text-primary">
              {sent ? "Request Ready" : "Catering Request"}
            </h2>

            {!sent && (
              <p className="mt-1 text-xs text-muted-foreground">
                Tell us about your event and we'll get back to you.
              </p>
            )}
          </div>

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
          <div className="mt-6">
            <p className="text-sm leading-relaxed text-foreground/80">
              Your menu has been recorded. The next step is to connect
              this form to your preferred contact method so the complete
              catering request reaches you.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-md border-2 border-secondary bg-primary px-5 py-3 font-display text-base text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="q-name"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Name
                </label>

                <input
                  id="q-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="q-phone"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Phone
                </label>

                <input
                  id="q-phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="q-date"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Event Date
                </label>

                <input
                  id="q-date"
                  required
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="q-guests"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Guests
                </label>

                <input
                  id="q-guests"
                  required
                  min="1"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="e.g. 250"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="q-location"
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                Event Location
              </label>

              <input
                id="q-location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Venue / area"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="q-notes"
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                Additional Requirements
              </label>

              <textarea
                id="q-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Special dishes, dietary requirements, serving preferences..."
                className="mt-1 w-full resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-secondary"
              />
            </div>

            <div className="rounded-md bg-background/70 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Dishes selected
                </span>

                <span className="font-medium text-primary">
                  {selectedItems.length}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md border-2 border-secondary bg-primary px-5 py-3 font-display text-base text-primary-foreground transition-transform hover:scale-[1.01]"
            >
              Prepare Catering Request
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}