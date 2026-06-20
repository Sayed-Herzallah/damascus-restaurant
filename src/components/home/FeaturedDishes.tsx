import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

type Dish = {
  id: string;
  nameKey: string;
  descKey: string;
  price: number;
  rating: number;
  image: string;
  badgeKey?: string;
};

const featuredDishes: Dish[] = [
  {
    id: "e1",
    nameKey: "Mansaf",
    descKey: "Mansaf (lamb cooked in jameed yogurt, served on yellow rice with pine nuts)",
    price: 18,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    badgeKey: "menu.bestseller",
  },
  {
    id: "e2",
    nameKey: "Mixed Grill",
    descKey: "Mixed Grill (skewers of shish tawook, kafta kebab, and tender lamb chops)",
    price: 22,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    badgeKey: "menu.popular",
  },
  {
    id: "w4",
    nameKey: "Truffle Pasta",
    descKey: "Truffle Pasta (fresh tagliatelle pasta in a rich, creamy white truffle sauce)",
    price: 17,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80",
    badgeKey: "menu.special",
  },
];

export default function FeaturedDishes() {
  const { t, lang } = useLang();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };


  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            {t("menu.explore")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-3 text-foreground">
            {lang === "ar" ? "أطباقنا المميزة" : "Featured Masterpieces"}
          </h2>
          <OrnamentDivider className="max-w-md mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {lang === "ar"
              ? "تذوق أشهر أطباقنا المحضرة بعناية فائقة ووصفات تتوارثها الأجيال."
              : "Experience the absolute highlights of our menu, crafted with fine ingredients and ancestral secrets."}
          </p>
        </div>

        {/* Dishes Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredDishes.map((dish) => (
            <motion.article
              key={dish.id}
              className="group card-elegant rounded-2xl overflow-hidden flex flex-col h-full bg-card"
              variants={cardVariants}
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={dish.image}
                  alt={dish.nameKey}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating Badge */}
                {dish.badgeKey && (
                  <span className="absolute top-4 start-4 bg-gradient-warm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {t(dish.badgeKey)}
                  </span>
                )}
                
                {/* Heart Button */}
                <button className="absolute top-4 end-4 w-9 h-9 rounded-full bg-background/85 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-red-500 hover:scale-105 transition-all shadow-sm">
                  <Heart className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Info Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Rating & Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-foreground">{dish.rating}</span>
                  </div>
                  <span className="text-2xl font-serif font-extrabold text-primary">
                    ${dish.price}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {lang === "ar" ? t(`menu.${dish.id === "e1" ? "eastern" : dish.id === "e2" ? "sandwiches" : "western"}`) && t(`menu.${dish.id}`) || dish.nameKey : dish.nameKey}
                  {/* Fallback to dynamic translate if defined, or raw name */}
                  {lang === "ar" 
                    ? (dish.id === "e1" ? "منسف بلدي فاخر" : dish.id === "e2" ? "مشاوي مشكلة ملكية" : "باستا الكمأة الإيطالية") 
                    : dish.nameKey}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {lang === "ar"
                    ? (dish.id === "e1" 
                        ? "لحم غنم بلدي مطبوخ بجميد كركي أصيل، يُقدم فوق الأرز الأصفر المغطى بالصنوبر واللوز المقرمش." 
                        : dish.id === "e2"
                        ? "تشكيلة فاخرة من شيش الطاووق، كفتة لحم الغنم، وأسياخ لحم العجل المشوي على الفحم مع الخضار المشوية."
                        : "معكرونة التالياتيلي الطازجة بصلصة الكريمة الغنية والكمأة السوداء الفاخرة مع جبن البارميزان.")
                    : dish.descKey}
                </p>

                {/* Order / Explore Link */}
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Link to="/menu" className="flex items-center justify-center gap-2">
                    <span>{t("menu.explore")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All CTA */}
        <div className="text-center">
          <Button asChild variant="warm" size="lg">
            <Link to="/menu" className="flex items-center gap-2">
              <span>{t("menu.cta")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
