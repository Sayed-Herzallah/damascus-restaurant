import { motion } from "framer-motion";
import { Award, Utensils, Users, History } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function StatsSection() {
  const { t } = useLang();

  const stats = [
    { icon: History, value: "25+", key: "stats.experience" },
    { icon: Utensils, value: "15+", key: "stats.chefs" },
    { icon: Users, value: "10,000+", key: "stats.customers" },
    { icon: Award, value: "45+", key: "stats.dishes" },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };


  return (
    <section className="relative py-20 bg-gradient-warm text-primary-foreground overflow-hidden shadow-elegant transition-all duration-300">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className="space-y-3 group p-4 rounded-xl hover:bg-white/5 transition-colors duration-300"
                variants={itemVariants}
              >
                <div className="w-14 h-14 mx-auto bg-white/10 rounded-full flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6.5 h-6.5" />
                </div>
                <div className="font-serif text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-medium tracking-wide uppercase opacity-85 text-white/90">
                  {t(stat.key)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
