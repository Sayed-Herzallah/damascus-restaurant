import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

export default function ChefRecommendation() {
  const { t, lang } = useLang();

  const textVariants: any = {
    hidden: { opacity: 0, x: lang === "ar" ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };


  const listItems = lang === "ar"
    ? ["ورق عنب ملفوف يدوياً", "حمص كريمي بالزيتون البكر", "متبل باذنجان مشوي", "كبة شامية مقرمشة محشوة باللحم والمكسرات"]
    : ["Hand-rolled traditional vine leaves", "Creamy local hummus with olive oil", "Charred eggplant mutabbal (baba ghanoush)", "Crispy Shami kibbeh stuffed with pine nuts"];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-start"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider mx-auto lg:mx-0">
              <ChefHat className="w-4 h-4 text-accent" />
              <span>{t("chefRecommend.title")}</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              {t("chefRecommend.featuredDish")}
            </h2>

            <OrnamentDivider className="max-w-md mx-auto lg:mx-0" />

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("chefRecommend.featuredDishDesc")}
            </p>

            {/* List of Ingredients */}
            <div className="grid sm:grid-cols-2 gap-3 text-start max-w-lg mx-auto lg:mx-0 pt-2">
              {listItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </span>
                  <span className="text-sm font-medium opacity-90">{item}</span>
                </div>
              ))}
            </div>

            {/* Chef Quote Box */}
            <div className="border-s-4 border-accent bg-card/60 rounded-r-xl p-5 italic text-sm text-muted-foreground text-start shadow-sm mt-6">
              <p className="line-clamp-3 leading-relaxed">
                {lang === "ar"
                  ? "«المطبخ الشامي ليس مجرد طعام؛ إنه احتفال بالدفء والعائلة وتقاليد ممتدة لقرون. نحن نحضّر كل طبق وفي أذهاننا هذه الحكايات الجميلة.»"
                  : "“Shami cuisine is not just food; it's a celebration of family, warmth, and centuries of tradition. We prepare every platter with these stories in mind.”"}
              </p>
              <div className="mt-3 font-serif font-bold text-foreground not-italic flex items-center gap-2">
                <span className="w-6 h-0.5 bg-accent" />
                <span>{t("chefRecommend.signature")}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Button asChild variant="warm" size="lg">
                <Link to="/reservations" className="flex items-center gap-2">
                  <span>{t("nav.reservations")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/menu">{t("hero.cta.menu")}</Link>
              </Button>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="lg:col-span-5 relative"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Visual Frame */}
            <div className="absolute -inset-4 border border-accent/20 rounded-2xl pointer-events-none translate-x-2 translate-y-2 hidden sm:block" />
            
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant bg-muted group relative">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Chef Recommended Mezze Platter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-start">
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">
                  {lang === "ar" ? "شعبية ولذيذة" : "Top Selected"}
                </p>
                <h4 className="font-serif text-xl font-bold">
                  {lang === "ar" ? "مقبلات شامية مشكلة" : "Authentic Shami Mezze"}
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
