import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";

export default function Hero() {
  const { t, lang } = useLang();

  // Check if currently open (12pm - 12am)
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 12 && currentHour < 24;

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
          alt="Restaurant Ambiance"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Premium smooth dark vignette overlay - preserves photo natural colors while ensuring text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/60 z-[1]" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 text-center space-y-7 max-w-4xl px-6"
      >
        {/* Live Status Badge */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90">
            <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              {isOpen
                ? (lang === "ar" ? "مفتوح الآن · نرحب بضيوفنا" : "Open Now · Welcoming Guests")
                : (lang === "ar" ? "مغلق حالياً · نلتقي قريباً" : "Closed · See You Soon")}
            </span>
          </div>
        </motion.div>

        {/* Rating tag */}
        <motion.div variants={itemVariants} className="flex justify-center -mt-2">
          <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold drop-shadow-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ms-1.5 text-amber-200">4.9</span>
            <span className="mx-1">·</span>
            <span>{lang === "ar" ? "+2,500 تقييم" : "+2,500 Reviews"}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95]"
        >
          <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-xl">
            {t("hero.title")}
          </span>
        </motion.h1>

        {/* Decorative Line */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-2xl text-stone-100 max-w-2xl mx-auto font-serif italic leading-relaxed font-semibold drop-shadow-md"
        >
          {t("hero.tagline")}
        </motion.p>

        {/* Info chips */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-white/90 font-medium text-xs md:text-sm drop-shadow-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {t("contact.addressVal")}
          </span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-amber-400" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {lang === "ar" ? "يومياً 12:00م - 12:00ص" : "Daily 12:00 PM - 12:00 AM"}
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button asChild variant="warm" size="lg" className="px-10 py-6 text-base shadow-lg shadow-[#bc381e]/20 hover:shadow-xl hover:shadow-[#bc381e]/30 group rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer">
            <Link to="/menu" className="flex items-center gap-2.5">
              <span className="font-bold">{t("hero.cta.menu")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button asChild size="lg" className="px-10 py-6 text-base bg-stone-900/40 hover:bg-stone-900/60 dark:bg-black/40 dark:hover:bg-black/60 text-white border border-white/30 backdrop-blur-md rounded-xl group transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl">
            <Link to="/reservations" className="flex items-center gap-2.5">
              <CalendarDays className="w-5 h-5 text-amber-300" />
              <span className="font-bold">{t("nav.reservations")}</span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into page - kept subtle (h-10) to prevent washed-out/faded appearance */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent z-[3] pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-stone-800/80 dark:border-white/60 flex items-start justify-center p-1.5 bg-stone-200/30 dark:bg-black/20 backdrop-blur-xs">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
