/* -----------------------------------------------------------------------
 * menu-data.ts
 *
 * ALL test/sample data for the Build Your Menu page lives here.
 * When you're ready for production, just replace the contents of
 * DEFAULT_ITEMS, CUISINE_POOL, TIER_CONFIG and TIERS_META below —
 * nothing in menu.tsx needs to change as long as the shapes match.
 * --------------------------------------------------------------------- */

/** Items that appear in every menu automatically (locked "Default" box). */
export const DEFAULT_ITEMS = ["Plain Rice", "Pickles", "Papad", "Salad", "Ghee"];

/** Catalog shown in the "Browse Dishes" panel, grouped by cuisine. */
export const CUISINE_POOL: Record<string, string[]> = {
  "South Indian": ["Idli", "Dosa", "Sambar", "Rasam", "Pongal", "Uttapam"],
  "North Indian": [
    "Paneer Butter Masala",
    "Dal Makhani",
    "Naan",
    "Jeera Rice",
    "Chole",
    "Malai Kofta",
  ],
  Chinese: [
    "Veg Manchurian",
    "Fried Rice",
    "Hakka Noodles",
    "Chilli Paneer",
    "Spring Roll",
    "Sweet Corn Soup",
  ],
  Curries: [
    "Kadai Veg",
    "Chana Masala",
    "Veg Kofta",
    "Mixed Veg Curry",
    "Paneer Tikka Masala",
    "Bhindi Masala",
  ],
  Snacks: ["Samosa", "Veg Cutlet", "Paneer Tikka", "Aloo Tikki", "Mirchi Bajji", "Corn Chaat"],
  "Pan Asian": ["Thai Curry", "Sushi Rolls", "Dim Sum", "Pad Thai", "Basil Fried Rice"],
  Continental: ["Pasta Alfredo", "Grilled Veg", "Garlic Bread", "Baked Beans"],
};

/** Flat, de-duplicated list of every dish — used for generic search/autocomplete. */
export const ALL_DISHES = Array.from(
  new Set([...DEFAULT_ITEMS, ...Object.values(CUISINE_POOL).flat()]),
);

export type TierId = "traditional" | "gold" | "platinum" | "customize";

/** Which cuisines + how many items per cuisine each package prefills. */
export const TIER_CONFIG: Record<TierId, { cuisines: string[]; itemsPerCuisine: number }> = {
  traditional: { cuisines: ["South Indian", "North Indian", "Snacks"], itemsPerCuisine: 2 },
  gold: {
    cuisines: ["South Indian", "North Indian", "Chinese", "Curries", "Snacks"],
    itemsPerCuisine: 3,
  },
  platinum: {
    cuisines: ["South Indian", "North Indian", "Chinese", "Curries", "Snacks"],
    itemsPerCuisine: 4,
  },
  customize: { cuisines: [], itemsPerCuisine: 0 },
};

export type TierMeta = {
  id: TierId;
  label: string;
  tagline: string;
};

/** Labels/taglines for the small package icons shown above "Your Menu". */
export const TIERS_META: TierMeta[] = [
  { id: "traditional", label: "Traditional", tagline: "Classic favourites, done right" },
  { id: "gold", label: "Gold", tagline: "A richer, fuller spread" },
  { id: "platinum", label: "Platinum", tagline: "Our finest, no compromises" },
  { id: "customize", label: "Customize", tagline: "Build it exactly your way" },
];

export const MAX_BOXES = 8;
export const MAX_ITEMS_PER_BOX = 4;

export type MenuBox = {
  id: string;
  name: string;
  items: string[];
  maxItems: number;
  /** Locked boxes (Default) can't have items added/removed or be deleted. */
  locked?: boolean;
};

export function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

/** Builds the starting set of boxes for a given package/tier. */
export function buildBoxesForTier(tierId: TierId): MenuBox[] {
  if (tierId === "customize") return [];

  const config = TIER_CONFIG[tierId];
  const boxes: MenuBox[] = [
    {
      id: makeId(),
      name: "Default",
      items: [...DEFAULT_ITEMS],
      maxItems: DEFAULT_ITEMS.length,
      locked: true,
    },
  ];

  config.cuisines.forEach((cuisine) => {
    boxes.push({
      id: makeId(),
      name: cuisine,
      items: (CUISINE_POOL[cuisine] || []).slice(0, config.itemsPerCuisine),
      maxItems: MAX_ITEMS_PER_BOX,
    });
  });

  return boxes;
}
