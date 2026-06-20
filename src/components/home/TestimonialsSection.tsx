import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

type Testimonial = {
  name: string;
  roleKey: string;
  textEn: string;
  textAr: string;
  rating: number;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah J.",
    roleKey: "Guest from Amman",
    textEn: "A true culinary journey. The Mansaf here tastes exactly like the one my grandmother used to make in Amman. The service is incredibly warm.",
    textAr: "رحلة حقيقية في عالم الطهي. المنسف هنا يذكرني بطعم المنسف الأصيل الذي كانت تعده جدتي في عمان. الخدمة دافئة وراقية للغاية.",
    rating: 5,
    initials: "SJ",
  },
  {
    name: "Karam A.",
    roleKey: "Regular Visitor",
    textEn: "The mixed grill is juicy and perfectly seasoned, and the atmosphere makes you feel like you are sitting in an old house in Damascus. 5 stars!",
    textAr: "المشاوي المشكلة طرية ومتبلة بشكل مثالي. الأجواء الدافئة والموسيقى تشعرك وكأنك تجلس في فناء بيت دمشقي قديم. 5 نجوم بلا تردد!",
    rating: 5,
    initials: "KA",
  },
  {
    name: "Emma W.",
    roleKey: "Food Critic",
    textEn: "We booked a table for our anniversary. The outdoor terrace is romantic, the service is impeccable, and the truffle pasta was outstanding.",
    textAr: "حجزنا طاولة بمناسبة ذكرى زواجنا. التراس الخارجي رائع ورومانسي والخدمة ممتازة، وباستا الكمأة كانت مذهلة ولذيذة جداً.",
    rating: 5,
    initials: "EW",
  },
];

export default function TestimonialsSection() {
  const { t, lang } = useLang();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };


  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            {lang === "ar" ? "آراء الضيوف" : "Testimonials"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-3 text-foreground">
            {t("testimonials.title")}
          </h2>
          <OrnamentDivider className="max-w-md mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {t("testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              className="card-elegant rounded-2xl p-8 relative flex flex-col justify-between h-full bg-card"
              variants={cardVariants}
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 end-6 w-10 h-10 text-primary/10 select-none pointer-events-none" />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic relative z-10">
                  “{lang === "ar" ? item.textAr : item.textEn}”
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/40">
                <span className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center text-white font-bold text-sm shadow-soft shrink-0">
                  {item.initials}
                </span>
                <div className="text-start">
                  <h4 className="font-serif text-base font-bold text-foreground">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" 
                      ? (item.roleKey === "Guest from Amman" ? "ضيف من عمان" : item.roleKey === "Regular Visitor" ? "زائر دائم" : "ناقد طعام")
                      : item.roleKey}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
