import React, { createContext, useContext, useState, useEffect } from "react";
import { menu as defaultMenu, MenuItem, MenuCategory } from "@/data/menu";

// Version key — increment when default data changes to force localStorage refresh
const MENU_VERSION = "v2";
const STORAGE_KEY = "layali_menu_items";
const VERSION_KEY = "layali_menu_version";

type MenuContextType = {
  menuItems: MenuItemWithCategory[];
  categories: { slug: string; title_en: string; title_ar: string }[];
  addItem: (item: Omit<MenuItemWithCategory, "id">) => void;
  updateItem: (item: MenuItemWithCategory) => void;
  deleteItem: (id: string) => void;
};

export type MenuItemWithCategory = MenuItem & {
  categorySlug: "appetizers" | "eastern" | "sandwiches" | "western" | "desserts" | "drinks";
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Helper to map default menu to flat items
const getFlatDefaultMenu = (): MenuItemWithCategory[] => {
  return defaultMenu.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categorySlug: cat.slug,
    }))
  );
};

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([]);

  // Load from localStorage or default — with version invalidation
  useEffect(() => {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    // If version mismatch or no stored data, reset to defaults
    if (storedVersion !== MENU_VERSION || !stored) {
      const flat = getFlatDefaultMenu();
      setMenuItems(flat);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
      localStorage.setItem(VERSION_KEY, MENU_VERSION);
    } else {
      try {
        setMenuItems(JSON.parse(stored));
      } catch (e) {
        const flat = getFlatDefaultMenu();
        setMenuItems(flat);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
        localStorage.setItem(VERSION_KEY, MENU_VERSION);
      }
    }
  }, []);

  const saveMenu = (newItems: MenuItemWithCategory[]) => {
    setMenuItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  // Dynamic categories: only includes categories that actually contain at least 1 item
  const categories = React.useMemo(() => {
    const allCategories = [
      { slug: "appetizers", title_en: "Appetizers", title_ar: "مقبلات وسلطات" },
      { slug: "eastern", title_en: "Eastern Dishes", title_ar: "أطباق شرقية" },
      { slug: "sandwiches", title_en: "Sandwiches", title_ar: "سندويشات" },
      { slug: "western", title_en: "Western Meals", title_ar: "وجبات غربية" },
      { slug: "desserts", title_en: "Desserts", title_ar: "حلويات" },
      { slug: "drinks", title_en: "Beverages", title_ar: "مشروبات" },
    ];

    // Filter categories that have at least one item
    return allCategories.filter((cat) =>
      menuItems.some((item) => item.categorySlug === cat.slug)
    );
  }, [menuItems]);

  const addItem = (item: Omit<MenuItemWithCategory, "id">) => {
    // Generate a unique id based on category and random number
    const categoryPrefix = item.categorySlug.substring(0, 2);
    const newId = `${categoryPrefix}${Math.floor(100 + Math.random() * 900)}`;
    const newItem: MenuItemWithCategory = { ...item, id: newId };
    const updated = [newItem, ...menuItems];
    saveMenu(updated);
  };

  const updateItem = (updatedItem: MenuItemWithCategory) => {
    const updated = menuItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveMenu(updated);
  };

  const deleteItem = (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id);
    saveMenu(updated);
  };

  return (
    <MenuContext.Provider value={{ menuItems, categories, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
}
