import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

type GalleryItem = {
  id: number;
  category: "food" | "ambiance" | "kitchen";
  image: string;
  titleEn: string;
  titleAr: string;
};

const items: GalleryItem[] = [
  {
    id: 1,
    category: "food",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    titleEn: "Traditional Mansaf",
    titleAr: "المنسف الأردني التقليدي",
  },
  {
    id: 2,
    category: "food",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    titleEn: "Grand Mezze Platter",
    titleAr: "طبق مقبلات ليالي شامي",
  },
  {
    id: 3,
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    titleEn: "Cozy Dining Lounge",
    titleAr: "جلسات الصالة الداخلية الدافئة",
  },
  {
    id: 4,
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    titleEn: "Elegant Window Tables",
    titleAr: "طاولات إطلالة النافذة الفاخرة",
  },
  {
    id: 5,
    category: "kitchen",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    titleEn: "Master Chef in Action",
    titleAr: "إعداد الأطباق بأيدي طهاتنا",
  },
  {
    id: 6,
    category: "food",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    titleEn: "Royal Mixed Grill",
    titleAr: "المشاوي الملكية المشكلة",
  },
];

export default function GallerySection() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<"all" | "food" | "ambiance" | "kitchen">("all");

  const filteredItems = items.filter(
    (item) => filter === "all" || item.category === filter
  );

  const categories = [
    { key: "all", label: t("gallery.all") },
    { key: "food", label: t("gallery.food") },
    { key: "ambiance", label: t("gallery.ambiance") },
    { key: "kitchen", label: t("gallery.kitchen") },
  ];

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            {lang === "ar" ? "معرضنا البصري" : "Visual Journey"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-3 text-foreground">
            {t("gallery.title")}
          </h2>
          <OrnamentDivider className="max-w-md mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {t("gallery.subtitle")}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filter === cat.key
                  ? "bg-primary border-primary text-primary-foreground shadow-soft"
                  : "border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-muted cursor-pointer border border-border/40"
              >
                <img
                  src={item.image}
                  alt={item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-start">
                  <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">
                    {t(`gallery.${item.category}`)}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {lang === "ar" ? item.titleAr : item.titleEn}
                  </h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
