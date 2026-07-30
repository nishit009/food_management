export type MenuItem = { id: string; name: string };
export type MenuCategory = { id: string; name: string; items: MenuItem[] };
export type MenuPackage = {
  id: string;
  name: string;
  blurb: string;
  categories: MenuCategory[];
};

const cat = (id: string, name: string, items: string[]): MenuCategory => ({
  id,
  name,
  items: items.map((n) => ({ id: `${id}-${n.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: n })),
});

export const menuPackages: MenuPackage[] = [
  {
    id: "prasadam",
    name: "Prasadam Menu",
    blurb: "Sattvic temple offerings, no onion or garlic.",
    categories: [
      cat("prasadam-sweets", "Sweets", ["Sakkarai Pongal", "Kesari", "Laddu", "Payasam"]),
      cat("prasadam-rice", "Rice", ["Puliyodarai", "Curd Rice", "Ven Pongal", "Coconut Rice"]),
      cat("prasadam-snacks", "Snacks", ["Vada", "Murukku", "Appam", "Sundal"]),
      cat("prasadam-drinks", "Drinks", ["Panakam", "Neer Mor", "Filter Coffee"]),
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast Menu",
    blurb: "Morning tiffin spread served hot off the stone griddle.",
    categories: [
      cat("bf-tiffin", "Tiffin", ["Idli", "Masala Dosa", "Pongal", "Poori Masala", "Upma"]),
      cat("bf-sides", "Sides", ["Sambar", "Coconut Chutney", "Tomato Chutney", "Milagai Podi"]),
      cat("bf-sweets", "Sweets", ["Kesari", "Rava Laddu", "Jilebi"]),
      cat("bf-drinks", "Drinks", ["Filter Coffee", "Masala Chai", "Badam Milk", "Buttermilk"]),
    ],
  },
  {
    id: "silver",
    name: "Silver Menu",
    blurb: "A generous everyday feast for family gatherings.",
    categories: [
      cat("sv-snacks", "Snacks", ["French Fries", "Veg Manchurian", "Spring Rolls", "Cutlet"]),
      cat("sv-sweets", "Sweets", ["Rasgulla", "Gulab Jamun", "Laddu", "Jilebi"]),
      cat("sv-rice", "Rice", ["Plain Rice", "Veg Biryani", "Jeera Rice", "Lemon Rice"]),
      cat("sv-curries", "Curries", ["Dal Tadka", "Aloo Gobi", "Paneer Butter Masala", "Sambar"]),
      cat("sv-starters", "Starters", ["Gobi 65", "Paneer Tikka", "Mixed Veg Pakoda"]),
      cat("sv-desserts", "Desserts", ["Semiya Payasam", "Fruit Salad", "Ice Cream"]),
      cat("sv-drinks", "Drinks", ["Buttermilk", "Rose Milk", "Lime Soda"]),
    ],
  },
  {
    id: "gold",
    name: "Gold Menu",
    blurb: "Our royal banquet — the full Kumbhakarna spread.",
    categories: [
      cat("gd-welcome", "Welcome Drinks", ["Panakam", "Jaljeera", "Rose Milk", "Tender Coconut"]),
      cat("gd-starters", "Starters", [
        "Paneer Tikka",
        "Hara Bhara Kebab",
        "Baby Corn Manchurian",
        "Mushroom 65",
      ]),
      cat("gd-snacks", "Snacks", ["Samosa", "Spring Rolls", "Masala Vada", "Bonda"]),
      cat("gd-rice", "Rice & Breads", [
        "Hyderabadi Veg Biryani",
        "Ghee Rice",
        "Bagara Rice",
        "Butter Naan",
        "Phulka",
      ]),
      cat("gd-curries", "Curries", [
        "Paneer Butter Masala",
        "Malai Kofta",
        "Kadai Vegetable",
        "Chettinad Kurma",
        "Avial",
      ]),
      cat("gd-sweets", "Sweets", ["Gulab Jamun", "Kaju Katli", "Badusha", "Mysore Pak", "Jilebi"]),
      cat("gd-desserts", "Desserts", ["Rabri", "Semiya Payasam", "Kulfi", "Fruit Trifle"]),
      cat("gd-drinks", "Drinks", ["Filter Coffee", "Masala Chai", "Mango Lassi", "Buttermilk"]),
    ],
  },
  {
    id: "custom",
    name: "Custom Menu",
    blurb: "Build your own spread, dish by dish.",
    categories: [
      cat("cs-snacks", "Snacks", [
        "French Fries",
        "Veg Manchurian",
        "Spring Rolls",
        "Cutlet",
        "Samosa",
      ]),
      cat("cs-starters", "Starters", ["Paneer Tikka", "Gobi 65", "Mushroom Pepper Fry"]),
      cat("cs-rice", "Rice", ["Plain Rice", "Biryani", "Jeera Rice", "Curd Rice"]),
      cat("cs-curries", "Curries", ["Dal Fry", "Sambar", "Rasam", "Mixed Veg Kurma"]),
      cat("cs-sweets", "Sweets", ["Rasgulla", "Gulab Jamun", "Laddu", "Jilebi"]),
      cat("cs-desserts", "Desserts", ["Payasam", "Ice Cream", "Fruit Salad"]),
      cat("cs-drinks", "Drinks", ["Buttermilk", "Lime Soda", "Filter Coffee"]),
    ],
  },
];
