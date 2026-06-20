import { Leaf, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

export default function AboutSection() {
  const { t } = useLang();

  const badges = [
    { icon: Leaf, labelKey: "about.badge1" },
    { icon: Award, labelKey: "about.badge2" },
    { icon: Heart, labelKey: "about.badge3" },
  ];

  return (
    <section className="container py-24 md:py-32 text-center relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          {t("about.title")}
        </h2>
        <OrnamentDivider className="max-w-md mx-auto" />
        <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-serif italic">
          {t("about.body")}
        </p>
      </motion.div>

      {/* Value Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
      >
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="card-elegant rounded-2xl p-6 flex flex-col items-center text-center bg-card shadow-soft group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-foreground">
                {t(badge.labelKey)}
              </h4>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
