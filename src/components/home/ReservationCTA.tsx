import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

export default function ReservationCTA() {
  const { t, lang } = useLang();

  return (
    <section className="relative py-28 overflow-hidden bg-stone-900 text-stone-100">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/80 to-stone-950/90" />
      </div>

      <div className="container relative z-10 text-center space-y-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto mb-2">
            <CalendarDays className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {lang === "ar" ? "هل ترغب في عيش تجربة استثنائية؟" : "Create Unforgettable Memories"}
          </h2>

          <OrnamentDivider className="max-w-md mx-auto mb-4 text-accent" />

          <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {lang === "ar"
              ? "سواء كانت عشاءً عائلياً دافئاً أو مناسبة خاصة، نحن نهيئ لك الأجواء المثالية ونقدم لك أشهى الأطباق الشامية الفاخرة."
              : "Whether it's an intimate family dinner or a grand celebratory occasion, we prepare the perfect table and flavors for you."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-6 flex flex-wrap justify-center gap-4"
        >
          <Button asChild variant="warm" size="lg" className="px-8">
            <Link to="/reservations" className="flex items-center gap-2">
              <CalendarDays className="w-4.5 h-4.5" />
              <span>{t("nav.reservations")}</span>
              <ArrowRight className="w-4 h-4 ms-1" />
            </Link>
          </Button>

          <Button asChild size="lg" className="px-8 bg-transparent border border-white/20 hover:border-white text-stone-100 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl">
            <Link to="/contact">{t("hero.cta.contact")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
