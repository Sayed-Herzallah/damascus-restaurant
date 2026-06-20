import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

const dict: Dict = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.service": { en: "Customer Service", ar: "خدمة العملاء" },
  "nav.contact": { en: "Contact Us", ar: "تواصل معنا" },
  "nav.reservations": { en: "Book a Table", ar: "حجز طاولة" },
  "nav.admin": { en: "Admin Dashboard", ar: "لوحة الإدارة" },
  "nav.login": { en: "Sign In", ar: "تسجيل الدخول" },
  "nav.logout": { en: "Sign Out", ar: "تسجيل الخروج" },

  // Hero
  "hero.badge": { en: "Authentic Levantine Restaurant", ar: "مطعم شامي أصيل" },
  "hero.title": { en: "Layali Shami", ar: "ليالي شامي" },
  "hero.tagline": { en: "Where every night tells a Shami story of flavor and heritage", ar: "حيث تروي كل ليلة حكاية شامية تجمع بين العراقة والنكهة" },
  "hero.cta.menu": { en: "Explore Menu", ar: "تصفح القائمة" },
  "hero.cta.contact": { en: "Contact Us", ar: "تواصل معنا" },

  // About
  "about.title": { en: "The Soul of the Levant", ar: "روح بلاد الشام" },
  "about.body": {
    en: "At Layali Shami we honor the heritage of Shami cuisine with a modern touch. Dishes that echo the memory of grandparents, served in warm spaces that recall the nights of Damascus, Beirut and Jerusalem. Every ingredient is sourced with care, and every recipe is crafted to tell a story of authentic flavors.",
    ar: "في ليالي شامي نحتفي بإرث المطبخ الشامي بلمسة عصرية. أطباق تستحضر ذكريات الأجداد، تُقدّم في أجواء دافئة تعيدك إلى ليالي دمشق وبيروت والقدس. نختار مكوناتنا بعناية فائقة ونحضرها بشغف لتستمتعوا بالنكهة الشامية الأصيلة."
  },
  "about.badge1": { en: "Fresh Ingredients", ar: "مكونات طازجة" },
  "about.badge2": { en: "Authentic Recipes", ar: "وصفات أصيلة" },
  "about.badge3": { en: "Warm Hospitality", ar: "ضيافة دافئة" },

  // Digital Menu General
  "menu.cta": { en: "Discover Our Menu", ar: "اكتشف قائمتنا" },
  "menu.sub": { en: "Three worlds of flavor await you", ar: "ثلاثة عوالم من النكهات بانتظارك" },
  "menu.title": { en: "Our Digital Menu", ar: "قائمة طعامنا الرقمية" },
  "menu.subtitle": { en: "Flavors that tell the story of the Levant", ar: "نكهات تروي قصة بلاد الشام بأناقة" },
  "menu.eastern": { en: "Eastern Dishes", ar: "أطباق شرقية" },
  "menu.sandwiches": { en: "Sandwiches", ar: "السندويشات" },
  "menu.western": { en: "Western Meals", ar: "وجبات غربية" },
  "menu.explore": { en: "Explore", ar: "استعرض" },
  "menu.search": { en: "Search dishes...", ar: "ابحث عن الأطباق..." },
  "menu.filterAll": { en: "All Categories", ar: "جميع الأصناف" },
  "menu.priceLowHigh": { en: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
  "menu.priceHighLow": { en: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
  "menu.noResults": { en: "No dishes found matching your criteria.", ar: "لم نجد أي أطباق تطابق نتائج البحث." },
  
  // Badges
  "menu.popular": { en: "Popular", ar: "شائع" },
  "menu.bestseller": { en: "Best Seller", ar: "الأكثر مبيعاً" },
  "menu.special": { en: "Special Offer", ar: "عرض خاص" },

  // Stats
  "stats.experience": { en: "Years of Heritage", ar: "سنة من العراقة" },
  "stats.chefs": { en: "Master Chefs", ar: "طهاة محترفين" },
  "stats.customers": { en: "Happy Guests", ar: "زبون سعيد" },
  "stats.dishes": { en: "Authentic Recipes", ar: "وصفة أصيلة" },

  // Chef Recommendation
  "chefRecommend.title": { en: "Chef's Recommendation", ar: "توصية الشيف" },
  "chefRecommend.subtitle": { en: "A hand-picked specialty that captures the essence of our kitchen.", ar: "طبق مميز اخترناه بعناية ليجسد جوهر مطبخنا العريق." },
  "chefRecommend.signature": { en: "Executive Chef, Layali Shami", ar: "كبير طهاة ليالي شامي" },
  "chefRecommend.featuredDish": { en: "Grand Royal Mezze Platter", ar: "طبق المقبلات الملكي الفاخر" },
  "chefRecommend.featuredDishDesc": { 
    en: "A beautiful selection of rich Shami appetizers including hand-rolled vine leaves, creamy hummus, mutabbal, and crispy kibbeh. Perfect for sharing and exploring the diverse flavors of the Levant.", 
    ar: "تشكيلة مختارة من المقبلات الشامية الفاخرة تشمل ورق العنب الملفوف يدوياً، الحمص الكريمي، المتبل، والكبة المقرمشة. مثالية للمشاركة واستكشاف نكهات بلاد الشام الغنية." 
  },

  // Testimonials
  "testimonials.title": { en: "What Our Guests Say", ar: "ماذا يقول ضيوفنا" },
  "testimonials.subtitle": { en: "Real experiences and stories shared by our valued visitors.", ar: "تجارب وانطباعات حقيقية يشاركها معنا زوارنا الأفاضل." },

  // Gallery
  "gallery.title": { en: "Our Visual Gallery", ar: "معرض الصور" },
  "gallery.subtitle": { en: "Take a visual tour of our dishes, ambiance, and kitchen secrets.", ar: "ألقِ نظرة على أطباقنا، الأجواء الدافئة، وكواليس مطبخنا." },
  "gallery.all": { en: "All", ar: "الكل" },
  "gallery.food": { en: "Dishes", ar: "الأطباق" },
  "gallery.ambiance": { en: "Ambiance", ar: "الأجواء" },
  "gallery.kitchen": { en: "Kitchen", ar: "المطبخ" },

  // FAQs
  "faq.title": { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  "faq.subtitle": { en: "Find quick answers to common queries about our restaurant.", ar: "إجابات سريعة للأسئلة الشائعة حول خدماتنا وأوقاتنا." },

  // Opening Hours
  "hours.title": { en: "Opening Hours", ar: "ساعات العمل" },
  "hours.body": { en: "Open daily from 12:00 noon to 12:00 midnight", ar: "نفتح يومياً من 12 ظهراً حتى 12 منتصف الليل" },
  "hours.openNow": { en: "Open Now", ar: "مفتوح الآن" },
  "hours.closedNow": { en: "Closed Now", ar: "مغلق الآن" },

  // Contact Page
  "contact.title": { en: "Customer Service", ar: "خدمة العملاء" },
  "contact.subtitle": { en: "We'd love to hear from you. Get in touch with our team.", ar: "نسعد بسماع آرائكم واستفساراتكم. تواصلوا مع فريقنا." },
  "contact.tabContact": { en: "Contact Us", ar: "تواصل معنا" },
  "contact.tabComplaint": { en: "Submit a Complaint", ar: "تقديم شكوى" },
  "contact.tabFaq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "contact.name": { en: "Name", ar: "الاسم" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "contact.message": { en: "Your Message", ar: "الرسالة" },
  "contact.subject": { en: "Complaint Subject", ar: "موضوع الشكوى" },
  "contact.details": { en: "Complaint Details", ar: "تفاصيل الشكوى" },
  "contact.send": { en: "Send Message", ar: "إرسال" },
  "contact.sending": { en: "Sending...", ar: "جاري الإرسال..." },
  "contact.success": { en: "Thanks! We'll get back to you soon.", ar: "شكراً لك! سنعاود التواصل قريباً." },
  "contact.successComplaint": { en: "Your complaint has been received and will be handled promptly.", ar: "تم استلام شكواك وسنعالجها بأسرع وقت." },
  "contact.successContact": { en: "Thanks for reaching out! We'll get back to you soon.", ar: "شكراً لتواصلك! سنرد عليك قريباً." },
  "contact.address": { en: "Address", ar: "العنوان" },
  "contact.addressVal": { en: "Damascus St., Amman, Jordan", ar: "شارع دمشق، عمان، الأردن" },

  // Reservation Page
  "reservation.title": { en: "Book a Table", ar: "احجز طاولتك" },
  "reservation.subtitle": { en: "Experience fine Shami dining. Book your table in advance.", ar: "عِش تجربة الضيافة الشامية الراقية. احجز طاولتك مسبقاً." },
  "reservation.date": { en: "Date", ar: "التاريخ" },
  "reservation.time": { en: "Time", ar: "الوقت" },
  "reservation.guests": { en: "Number of Guests", ar: "عدد الأفراد" },
  "reservation.session": { en: "Seating Option", ar: "مكان الجلوس" },
  "reservation.sessionIndoor": { en: "Indoor Area", ar: "صالة داخلية" },
  "reservation.sessionOutdoor": { en: "Outdoor Terrace", ar: "تراس خارجي" },
  "reservation.requests": { en: "Special Requests (Optional)", ar: "طلبات خاصة (اختياري)" },
  "reservation.submit": { en: "Confirm Reservation", ar: "تأكيد الحجز" },
  "reservation.successTitle": { en: "Reservation Confirmed!", ar: "تم تأكيد الحجز بنجاح!" },
  "reservation.successSubtitle": { en: "We look forward to welcoming you to Layali Shami.", ar: "نسعد بلقائكم واستضافتكم في ليالي شامي." },
  "reservation.receiptTitle": { en: "Reservation Details", ar: "تفاصيل الحجز" },
  "reservation.print": { en: "Print Receipt", ar: "طباعة الإيصال" },
  "reservation.backHome": { en: "Back to Home", ar: "العودة للرئيسية" },
  "reservation.guestName": { en: "Guest Name", ar: "اسم الضيف" },
  "reservation.guestPhone": { en: "Phone Number", ar: "رقم الهاتف" },
  "reservation.guestEmail": { en: "Email Address", ar: "البريد الإلكتروني" },
  "reservation.tableCode": { en: "Table Code", ar: "رمز الطاولة" },
  "reservation.refCode": { en: "Reference Code", ar: "رمز المرجع" },

  // Footer
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  "footer.contact": { en: "Contact", ar: "تواصل معنا" },
  "footer.follow": { en: "Follow Us", ar: "تابعنا" },
  "footer.about": { en: "About Us", ar: "عن المطعم" },
  "footer.desc": { en: "Layali Shami — an authentic Levantine (Shami) restaurant where every night tells a story of warmth, tradition and flavor.", ar: "ليالي شامي — مطعم شامي أصيل حيث تروي كل ليلة حكاية دافئة تجمع بين العراقة والنكهة الغنية." },
  "footer.newsletter": { en: "Newsletter", ar: "النشرة الإخبارية" },
  "footer.newsletterDesc": { en: "Subscribe to get our latest offers and recipes.", ar: "اشترك معنا لتصلك آخر العروض وأشهى الوصفات." },
  "footer.subscribe": { en: "Subscribe", ar: "اشتراك" },
  "footer.emailPlaceholder": { en: "Your email address", ar: "بريدك الإلكتروني" },
  "footer.successNewsletter": { en: "Thank you for subscribing!", ar: "شكرًا للاشتراك في نشرتنا!" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof dict | string) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "ar");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: (k) => {
        if (dict[k as string]) {
          return dict[k as string][lang];
        }
        // Fallback nested translations (supports old code and newer keys)
        return k as string;
      },
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
