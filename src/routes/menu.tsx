import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  Utensils,
  Crown,
  Sparkles,
  Settings2,
  Pencil,
  Plus,
  Search,
  Printer,
  Copy,
  Lock,
  ChevronDown,
} from "lucide-react";

import {
  ALL_DISHES,
  CUISINE_POOL,
  MAX_BOXES,
  MAX_ITEMS_PER_BOX,
  TIERS_META,
  buildBoxesForTier,
  makeId,
  type MenuBox,
  type TierId,
} from "../datasets/menu-data.ts";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Build Your Menu — Sree Ram Catering" },
      {
        name: "description",
        content: "Build your own catering menu by selecting dishes from our collection.",
      },
      { property: "og:title", content: "Build Your Menu — Sree Ram Catering" },
      {
        property: "og:description",
        content:
          "Create your own catering menu and send your requirements directly to Sree Ram Catering.",
      },
    ],
  }),
  component: MenuPage,
});

/** Icon shown next to each package/tier — kept in the component since data files stay JSX-free. */
const TIER_ICONS: Record<TierId, typeof Utensils> = {
  traditional: Utensils,
  gold: Sparkles,
  platinum: Crown,
  customize: Settings2,
};

/* ---------- Page ---------- */

function MenuPage() {
  const [selectedTier, setSelectedTier] = useState<TierId | null>(null);
  const [boxes, setBoxes] = useState<MenuBox[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuName, setMenuName] = useState("Your Menu");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(menuName);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const startEditingName = () => {
    setNameDraft(menuName);
    setEditingName(true);
  };

  const commitName = () => {
    const trimmed = nameDraft.trim();
    setMenuName(trimmed || "Your Menu");
    setEditingName(false);
  };

  const handleTierSelect = (tierId: TierId) => {
    setSelectedTier(tierId);
    setBoxes(buildBoxesForTier(tierId));
    setSelectedQuery("");
  };

  const addBox = () => {
    if (boxes.length >= MAX_BOXES) return;
    setSelectedTier((t) => t ?? "customize");
    setBoxes((prev) => [
      ...prev,
      { id: makeId(), name: "New Cuisine", items: [], maxItems: MAX_ITEMS_PER_BOX },
    ]);
  };

  const removeBox = (id: string) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const renameBox = (id: string, name: string) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, name: name || b.name } : b)));
  };

  /** Manual add via a specific box's own search (used for custom / renamed boxes). */
  const addItemToBox = (id: string, item: string) => {
    setBoxes((prev) =>
      prev.map((b) => {
        if (b.id !== id || b.locked) return b;
        if (b.items.includes(item) || b.items.length >= b.maxItems) return b;
        return { ...b, items: [...b.items, item] };
      }),
    );
  };

  /** Add via the catalog (Box A): finds the matching cuisine box in Box B, creating it if needed. */
  const addItemToCuisine = (cuisine: string, dish: string) => {
    setBoxes((prev) => {
      const existing = prev.find((b) => b.name === cuisine);
      if (existing) {
        if (existing.locked) return prev;
        if (existing.items.includes(dish) || existing.items.length >= existing.maxItems) {
          return prev;
        }
        return prev.map((b) => (b.id === existing.id ? { ...b, items: [...b.items, dish] } : b));
      }
      if (prev.length >= MAX_BOXES) return prev;
      return [...prev, { id: makeId(), name: cuisine, items: [dish], maxItems: MAX_ITEMS_PER_BOX }];
    });
    setSelectedTier((t) => t ?? "customize");
  };

  const removeItemFromBox = (id: string, item: string) => {
    setBoxes((prev) =>
      prev.map((b) =>
        b.id === id && !b.locked ? { ...b, items: b.items.filter((i) => i !== item) } : b,
      ),
    );
  };

  const totalItems = useMemo(() => boxes.reduce((sum, b) => sum + b.items.length, 0), [boxes]);

  const visibleBoxes = useMemo(() => {
    const q = selectedQuery.trim().toLowerCase();
    if (!q) return boxes.map((b) => ({ box: b, items: b.items }));
    return boxes
      .map((b) => ({ box: b, items: b.items.filter((i) => i.toLowerCase().includes(q)) }))
      .filter((entry) => entry.items.length > 0);
  }, [boxes, selectedQuery]);

  const menuText = () =>
    boxes
      .filter((b) => b.items.length > 0)
      .map((b) => `${b.name}:\n${b.items.map((item) => `  • ${item}`).join("\n")}`)
      .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${menuName}\n\n${menuText()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="stone-wash min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="-mt-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Sree Pavan Caterers
          </p>
          <h1 className="mt-1 text-2xl text-primary sm:text-3xl">Build Your Menu</h1>
          <p className="mx-auto mt-1.5 max-w-xl text-xs leading-snug text-muted-foreground">
            Pick a package, or add dishes from the catalog to build your own from scratch.
          </p>
          <div className="brass-rule mx-auto mt-3 w-28" />
        </header>

        {/* Menu builder panel — packages + catalog (A) + your menu (B) */}
        <div className="panel-carved mt-6 rounded-lg p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {editingName ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitName()}
                  onBlur={commitName}
                  className="rounded-md border border-secondary bg-background px-2 py-1 text-xl text-primary outline-none"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl text-primary">{menuName}</h2>
                  <button
                    type="button"
                    onClick={startEditingName}
                    aria-label="Edit menu name"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Add dishes from the catalog on the left, or pick a package on the right.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              {/* Package picker — small icons, replaces the old full-width tier row */}
              <div className="flex items-center gap-1.5">
                {TIERS_META.map((tier) => {
                  const Icon = TIER_ICONS[tier.id];
                  const active = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      title={`${tier.label} — ${tier.tagline}`}
                      aria-label={tier.label}
                      onClick={() => handleTierSelect(tier.id)}
                      className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                        active
                          ? "border-secondary bg-primary text-primary-foreground"
                          : "border-secondary/40 text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={addBox}
                  disabled={boxes.length >= MAX_BOXES}
                  className="flex items-center gap-1 rounded-full border border-secondary/50 px-3 py-1.5 text-xs text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Cuisine
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={totalItems === 0}
                  aria-label="Print menu"
                  className="grid h-8 w-8 place-items-center rounded-full border border-secondary/50 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Printer className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={totalItems === 0}
                  aria-label="Copy menu"
                  className="grid h-8 w-8 place-items-center rounded-full border border-secondary/50 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <span className="rounded-full border border-secondary/50 px-3 py-1.5 text-xs">
                  {totalItems}
                </span>
              </div>
            </div>
          </div>

          {/* A / B layout: catalog on the left, selected menu on the right */}
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {/* Box A — catalog */}
            <CuisineCatalogPanel boxes={boxes} onAddItem={addItemToCuisine} />

            {/* Box B — your menu, stacked vertically */}
            <div>
              {boxes.length > 0 && (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={selectedQuery}
                    onChange={(e) => setSelectedQuery(e.target.value)}
                    placeholder="Search your menu..."
                    className="w-full rounded-full border border-border bg-background/80 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-secondary"
                  />
                  {selectedQuery && (
                    <button
                      type="button"
                      onClick={() => setSelectedQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {boxes.length === 0 ? (
                <div className="mt-3 rounded-md border border-dashed border-border p-6 text-center lg:mt-0">
                  <Utensils className="mx-auto h-7 w-7 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">Your menu is empty.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add dishes from the catalog, or pick a package above.
                  </p>
                </div>
              ) : visibleBoxes.length === 0 ? (
                <div className="mt-3 rounded-md border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No dishes match "{selectedQuery}".
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {visibleBoxes.map(({ box, items }) => (
                    <SelectedCuisineCard
                      key={box.id}
                      box={box}
                      displayItems={items}
                      onRename={(name) => renameBox(box.id, name)}
                      onRemoveBox={() => removeBox(box.id)}
                      onAddItem={(item) => addItemToBox(box.id, item)}
                      onRemoveItem={(item) => removeItemFromBox(box.id, item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {totalItems > 0 && (
            <>
              <div className="brass-rule my-5" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total dishes</span>
                <span className="font-medium text-primary">{totalItems}</span>
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
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <QuoteModal boxes={boxes} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Box A: catalog / browse panel ---------- */

function CuisineCatalogPanel({
  boxes,
  onAddItem,
}: {
  boxes: MenuBox[];
  onAddItem: (cuisine: string, dish: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openCuisines, setOpenCuisines] = useState<Record<string, boolean>>({});

  const toggleCuisine = (name: string) => {
    setOpenCuisines((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const cuisineNames = useMemo(() => Object.keys(CUISINE_POOL), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cuisineNames
      .map((name) => ({
        name,
        items: q
          ? CUISINE_POOL[name].filter((d) => d.toLowerCase().includes(q))
          : CUISINE_POOL[name],
      }))
      .filter((c) => c.items.length > 0);
  }, [query, cuisineNames]);

  const boxFor = (cuisine: string) => boxes.find((b) => b.name === cuisine);

  return (
    <div className="rounded-md border border-border bg-background/60 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base text-primary">Browse Dishes</h3>
        <span className="text-[10px] text-muted-foreground">{ALL_DISHES.length} dishes</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Pick a cuisine, then add dishes to your menu.
      </p>

      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all dishes..."
          className="w-full rounded-full border border-border bg-background/80 py-2 pl-9 pr-8 text-xs outline-none transition focus:border-secondary"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-muted-foreground">
            No dishes match "{query}".
          </p>
        )}

        {filtered.map(({ name, items }) => {
          const isOpen = Boolean(openCuisines[name]) || query.trim().length > 0;
          const box = boxFor(name);
          const addedCount = box ? box.items.length : 0;

          return (
            <div key={name} className="overflow-hidden rounded-md border border-border/70">
              <button
                type="button"
                onClick={() => toggleCuisine(name)}
                className="flex w-full items-center justify-between gap-2 bg-background/80 px-3 py-2 text-left"
              >
                <span className="truncate font-display text-sm text-primary">{name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {addedCount > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      {addedCount} added
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="space-y-1 bg-background/40 p-2">
                  {items.map((dish) => {
                    const already = box?.items.includes(dish) ?? false;
                    const full = box ? box.items.length >= box.maxItems : false;
                    return (
                      <div
                        key={dish}
                        className="flex items-center justify-between gap-2 rounded-md bg-background px-2.5 py-1.5"
                      >
                        <span className="min-w-0 flex-1 truncate text-xs">{dish}</span>
                        <button
                          type="button"
                          onClick={() => onAddItem(name, dish)}
                          disabled={already || full}
                          aria-label={already ? `${dish} already added` : `Add ${dish}`}
                          className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {already ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Box B: selected cuisine card ---------- */

function SelectedCuisineCard({
  box,
  displayItems,
  onRename,
  onRemoveBox,
  onAddItem,
  onRemoveItem,
}: {
  box: MenuBox;
  displayItems: string[];
  onRename: (name: string) => void;
  onRemoveBox: () => void;
  onAddItem: (item: string) => void;
  onRemoveItem: (item: string) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(box.name);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const commitName = () => {
    onRename(nameDraft.trim());
    setEditingName(false);
  };

  // Fallback manual add — mainly useful for custom / renamed boxes that
  // don't exactly match a catalog cuisine name in Box A.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = ALL_DISHES.filter((dish) => !box.items.includes(dish));
    if (!q) return pool.slice(0, 5);
    return pool.filter((dish) => dish.toLowerCase().includes(q)).slice(0, 5);
  }, [query, box.items]);

  const full = box.items.length >= box.maxItems;

  const addAndClear = (dish: string) => {
    onAddItem(dish);
    setQuery("");
  };

  return (
    <div className="rounded-md border border-border bg-background/60 p-3">
      <div className="flex items-center justify-between gap-2">
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
            onBlur={commitName}
            className="min-w-0 flex-1 rounded-md border border-secondary bg-background px-2 py-1 text-sm text-primary outline-none"
          />
        ) : (
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-display text-sm text-primary">{box.name}</span>
            <button
              type="button"
              onClick={() => {
                setNameDraft(box.name);
                setEditingName(true);
              }}
              aria-label="Rename cuisine"
              className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
          {box.locked ? (
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <span className="text-[10px] text-muted-foreground">
              {box.items.length}/{box.maxItems}
            </span>
          )}
          {!box.locked && (
            <button
              type="button"
              onClick={onRemoveBox}
              aria-label="Remove cuisine box"
              className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? `Expand ${box.name}` : `Collapse ${box.name}`}
            aria-expanded={!collapsed}
            className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${collapsed ? "-rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-2 space-y-1.5">
          {displayItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-2 rounded-md bg-background/80 px-2.5 py-1.5"
            >
              <span className="min-w-0 flex-1 truncate text-xs">{item}</span>
              {!box.locked && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item)}
                  aria-label={`Remove ${item}`}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          {displayItems.length === 0 && (
            <p className="px-1 py-1 text-xs text-muted-foreground">No items yet.</p>
          )}
        </div>
      )}

      {/* Manual search + add — hidden for the locked Default box, and while collapsed */}
      {!box.locked && !collapsed && (
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions[0]) addAndClear(suggestions[0]);
            }}
            placeholder={full ? "Box full" : "Search dish to add..."}
            disabled={full}
            className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-2 text-xs outline-none focus:border-secondary disabled:opacity-50"
          />

          {focused && !full && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-background shadow-md">
              {suggestions.map((dish) => (
                <button
                  key={dish}
                  type="button"
                  onClick={() => addAndClear(dish)}
                  className="flex w-full items-center gap-1.5 truncate px-2.5 py-1.5 text-left text-xs hover:bg-muted"
                >
                  <Plus className="h-3 w-3 shrink-0 text-muted-foreground" />
                  {dish}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Quote modal ---------- */

function QuoteModal({ boxes, onClose }: { boxes: MenuBox[]; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const totalItems = boxes.reduce((sum, b) => sum + b.items.length, 0);

  const createMessage = () => {
    const menu = boxes
      .filter((b) => b.items.length > 0)
      .map((b) => `${b.name}:\n${b.items.map((item) => `  • ${item}`).join("\n")}`)
      .join("\n\n");

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
            <h2 className="text-2xl text-primary">{sent ? "Request Ready" : "Catering Request"}</h2>
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
              Your menu has been recorded. The next step is to connect this form to your preferred
              contact method so the complete catering request reaches you.
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
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
                <span className="text-muted-foreground">Dishes selected</span>
                <span className="font-medium text-primary">{totalItems}</span>
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
