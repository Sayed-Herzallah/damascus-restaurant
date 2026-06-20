import { useState, useEffect } from "react";
import { Star, Flame, Leaf, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MenuItem } from "@/data/menu";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

// Verified, high-quality Unsplash image URLs
export const dishImages: Record<string, string> = {
  // Appetizers
  a1: "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=600&q=80", // Hummus
  a2: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80", // Tabbouleh
  a3: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80", // Fattoush (fresh salad)
  a4: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80", // Kibbeh
  a5: "https://images.unsplash.com/photo-1625937329935-2874418f7b50?auto=format&fit=crop&w=600&q=80", // Vine Leaves

  // Eastern
  e1: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80", // Mansaf
  e2: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", // Mixed Grill
  e3: "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80", // Maqluba
  e4: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=600&q=80", // Fattet Hummus
  e5: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80", // Kabsa

  // Sandwiches
  s1: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80", // Shawarma Chicken (wrap)
  s2: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80", // Shawarma Beef
  s3: "https://images.unsplash.com/photo-1547058886-af77992d8d65?auto=format&fit=crop&w=600&q=80", // Falafel Wrap
  s4: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80", // Halloumi Saj
  s5: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", // Kebab Saj

  // Western
  w1: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80", // Ribeye
  w2: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80", // Pizza
  w3: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80", // Caesar Salad
  w4: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80", // Truffle Pasta
  w5: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80", // Alfredo

  // Desserts
  d1: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80", // Kunafa
  d2: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80", // Layali Lubnan
  d3: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", // Baklava
  d4: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80", // Umm Ali

  // Drinks
  dr1: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", // Lemonade
  dr2: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80", // Arabic Coffee
  dr3: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", // Tea
  dr4: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80", // Orange Juice
};

// High-quality generic fallback food platter image
const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

type Props = {
  item: MenuItem;
};

export default function MenuItemCard({ item }: Props) {
  const { lang, t } = useLang();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(dishImages[item.id] || fallbackImage);

  // Sync state with item ID modifications
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.includes(item.id));
    setImgSrc(dishImages[item.id] || fallbackImage);
  }, [item.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavs;
    if (isFavorite) {
      newFavs = favs.filter((id: string) => id !== item.id);
      toast.info(lang === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites");
    } else {
      newFavs = [...favs, item.id];
      toast.success(lang === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites");
    }
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };

  // Helper flags
  const isVegetarian = ["a1", "a2", "a3", "a5", "e4", "s3", "s4", "w2", "w3", "d1", "d2", "d3", "d4", "dr1", "dr2", "dr3", "dr4"].includes(item.id);
  const isSpicy = ["e2", "s1", "s5"].includes(item.id);
  const isBestSeller = ["e1", "s1", "w4", "d1", "dr1"].includes(item.id);

  const rating = item.rating || 4.5;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="group card-elegant rounded-2xl overflow-hidden flex flex-col h-full bg-card"
    >
      {/* Visual Box */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imgSrc}
          onError={handleImageError}
          alt={lang === "ar" ? item.name_ar : item.name_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Best Seller Badge */}
        {isBestSeller && (
          <span className="absolute top-4 start-4 bg-gradient-warm text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md z-10">
            {t("menu.bestseller")}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 end-4 w-8.5 h-8.5 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-all shadow-sm z-10"
        >
          <Heart className={cn("w-4.5 h-4.5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </button>

        {/* Indicators bar (spicy, veggie) at the bottom edge */}
        <div className="absolute bottom-3 start-3 flex gap-1.5 z-10">
          {isVegetarian && (
            <span className="flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              <Leaf className="w-3 h-3" />
              <span>{lang === "ar" ? "نباتي" : "Veg"}</span>
            </span>
          )}
          {isSpicy && (
            <span className="flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              <Flame className="w-3 h-3" />
              <span>{lang === "ar" ? "حار" : "Spicy"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-foreground">{rating}</span>
          </div>
          <span className="text-xl font-serif font-extrabold text-primary">
            ${item.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors text-start">
          {lang === "ar" ? item.name_ar : item.name_en}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed text-start flex-1 line-clamp-2">
          {lang === "ar" ? item.description_ar : item.description_en}
        </p>
      </div>
    </motion.article>
  );
}
