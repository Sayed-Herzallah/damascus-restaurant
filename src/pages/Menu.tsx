import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";
import { useMenu } from "@/context/MenuContext";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "default" | "rating" | "low-high" | "high-low";

export default function Menu() {
  const { lang, t } = useLang();
  const { hash } = useLocation();
  const { menuItems, categories } = useMenu();

  // Filters & State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);

  // Set initial category from location hash if present
  useEffect(() => {
    if (hash) {
      const category = hash.replace("#", "");
      const validCategories = ["appetizers", "eastern", "sandwiches", "western", "desserts", "drinks"];
      if (validCategories.includes(category)) {
        setActiveCategory(category);
      }
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  // Simulate loading state on mount or filter changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeCategory, sortBy, search]);

  // Dynamic categories list including "All"
  const categoriesList = useMemo(() => {
    return [
      { slug: "all", title_en: "All Categories", title_ar: "جميع الأصناف" },
      ...categories
    ];
  }, [categories]);

  // Filter & Sort Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = [...menuItems];

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((item) => item.categorySlug === activeCategory);
    }

    // Filter by Search Query
    if (search.trim() !== "") {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name_en.toLowerCase().includes(query) ||
          item.name_ar.includes(query) ||
          item.description_en.toLowerCase().includes(query) ||
          item.description_ar.includes(query)
      );
    }

    // Sort Items
    if (sortBy === "rating" || sortBy === "default") {
      result.sort((a, b) => {
        const rA = a.rating || 4.5;
        const rB = b.rating || 4.5;
        return rB - rA; // Sort high to low (top rated first)
      });
    } else if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menuItems, activeCategory, search, sortBy]);

  return (
    <div className="container py-16 transition-colors duration-300">
      {/* Header */}
      <header className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
          {t("menu.title")}
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold mt-4 mb-4 text-gradient-warm bg-gradient-warm">
          {t("menu.cta")}
        </h1>
        <OrnamentDivider className="max-w-md mx-auto" />
        <p className="text-muted-foreground mt-3">{t("menu.subtitle")}</p>
      </header>

      {/* Search and Filters Bar */}
      <div className="card-elegant rounded-2xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-card">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("menu.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10 bg-background"
          />
        </div>

        {/* Sorting & Filter Actions */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "ترتيب:" : "Sort:"}
            </span>
          </div>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-background min-w-[170px]"
          >
            <option value="default">{lang === "ar" ? "الافتراضي" : "Default"}</option>
            <option value="rating">{lang === "ar" ? "الأعلى تقييماً" : "Top Rated"}</option>
            <option value="low-high">{t("menu.priceLowHigh")}</option>
            <option value="high-low">{t("menu.priceHighLow")}</option>
          </Select>
        </div>
      </div>

      {/* Dynamic Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categoriesList.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeCategory === cat.slug
                ? "bg-primary border-primary text-primary-foreground shadow-soft"
                : "border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang === "ar" ? cat.title_ar : cat.title_en}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="border border-border/40 bg-card rounded-2xl p-5 space-y-4 shadow-soft">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredAndSortedItems.length > 0 ? (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAndSortedItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </motion.div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 card-elegant rounded-2xl bg-card max-w-md mx-auto"
            >
              <Inbox className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold mb-2">
                {lang === "ar" ? "لا توجد نتائج" : "No Results"}
              </h3>
              <p className="text-muted-foreground text-sm px-6">
                {t("menu.noResults")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
