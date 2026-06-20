import { UtensilsCrossed, Sandwich, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

export default function MenuCategoriesGrid() {
  const { t } = useLang();
  return (
    <section className="container pb-24 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 space-y-3"
      >
        <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
          {t("menu.explore")}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2">
          {t("menu.cta")}
        </h2>
        <OrnamentDivider className="max-w-md mx-auto" />
        <p className="text-muted-foreground">{t("menu.sub")}</p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <CategoryCard icon={UtensilsCrossed} title={t("menu.eastern")} href="/menu#eastern" delayMs={0} />
        <CategoryCard icon={Sandwich} title={t("menu.sandwiches")} href="/menu#sandwiches" delayMs={100} />
        <CategoryCard icon={ChefHat} title={t("menu.western")} href="/menu#western" delayMs={200} />
      </div>
    </section>
  );
}
