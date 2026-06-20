import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

type FaqItem = {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
};

const faqs: FaqItem[] = [
  {
    qEn: "Do you offer home delivery?",
    qAr: "هل تقدمون خدمة التوصيل للمنازل؟",
    aEn: "Yes, we deliver to all nearby areas. You can order directly by calling our phone number or through major delivery apps.",
    aAr: "نعم، نوفر خدمة التوصيل لجميع المناطق المجاورة. يمكنكم الطلب مباشرة عبر الاتصال بنا هاتفياً أو من خلال تطبيقات التوصيل الشهيرة.",
  },
  {
    qEn: "Do you accept event bookings and private parties?",
    qAr: "هل تقبلون الحجوزات للمناسبات والحفلات الخاصة؟",
    aEn: "Absolutely! We cater to private events, birthday parties, and family gatherings. Please contact us via the contact form or call us at least 48 hours in advance.",
    aAr: "بالتأكيد! نوفر خدمات الحجز والتنسيق للمناسبات، أعياد الميلاد، والاجتماعات العائلية. يرجى التواصل معنا عبر نموذج الاتصال أو الهاتف قبل 48 ساعة على الأقل.",
  },
  {
    qEn: "Do you have vegetarian and healthy options?",
    qAr: "هل لديكم خيارات نباتية وصحية؟",
    aEn: "Yes, our Levantine menu features a wide selection of vegetarian starters, salads, and mains such as Falafel, Hummus, Fattoush, and Halloumi dishes.",
    aAr: "نعم، تحتوي قائمتنا الشامية على تشكيلة واسعة ولذيذة من المقبلات، السلطات، والأطباق الرئيسية النباتية مثل الفلافل، الحمص، الفتوش، وأطباق الحلوم المشوي.",
  },
  {
    qEn: "What are your opening hours?",
    qAr: "ما هي ساعات العمل الرسمية؟",
    aEn: "We are open daily from 12:00 noon to 12:00 midnight, including weekends and public holidays.",
    aAr: "نفتح أبوابنا يومياً من الساعة 12 ظهراً وحتى 12 منتصف الليل، بما في ذلك عطلات نهاية الأسبوع والأعياد الرسمية.",
  },
  {
    qEn: "Is there a dedicated family section or partition?",
    qAr: "هل يوجد قسم عائلي مخصص أو حواجز للخصوصية؟",
    aEn: "Yes, we have a comfortable and spacious family section designed to give you and your loved ones complete privacy and comfort.",
    aAr: "نعم، لدينا قسم عائلي مخصص ومريح للغاية مصمم ليوفر لكم ولعائلتكم الخصوصية والراحة الكاملة.",
  },
];

export default function FaqSection() {
  const { t, lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="container relative z-10 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
            {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-3 text-foreground">
            {t("faq.title")}
          </h2>
          <OrnamentDivider className="max-w-md mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card-elegant rounded-2xl overflow-hidden bg-card transition-all duration-300"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-start font-serif text-base md:text-lg font-bold text-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-accent shrink-0" />
                    <span>{lang === "ar" ? faq.qAr : faq.qEn}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm md:text-base text-muted-foreground border-t border-border/40 pt-4 leading-relaxed bg-muted/10">
                        {lang === "ar" ? faq.aAr : faq.aEn}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
