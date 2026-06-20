import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ParkingCircle, Users, Wine, UtensilsCrossed } from "lucide-react";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";
import ReservationForm from "@/components/reservation/ReservationForm";
import ReservationReceipt, { ReservationDetails } from "@/components/reservation/ReservationReceipt";

export default function Reservations() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [successDetails, setSuccessDetails] = useState<ReservationDetails | null>(null);

  const handleSuccess = (details: ReservationDetails) => {
    setSuccessDetails(details);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSuccessDetails(null);
    navigate("/");
  };

  return (
    <div className="container py-12 md:py-20 min-h-[85vh] relative overflow-hidden transition-colors duration-300">
      {/* Decorative patterns */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {!successDetails ? (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Booking Wizard (Form) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header */}
              <header className="text-center lg:text-start space-y-3">
                <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5 inline-block">
                  {t("nav.reservations")}
                </span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-gradient-warm bg-gradient-warm leading-tight">
                  {t("reservation.title")}
                </h1>
                <OrnamentDivider className="max-w-md mx-auto lg:mx-0" />
                <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                  {t("reservation.subtitle")}
                </p>
              </header>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ReservationForm onSuccess={handleSuccess} />
              </motion.div>
            </div>

            {/* Right Column: Ambiance & Service Highlights (Premium sidebar) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              {/* Restaurant Photo Frame */}
              <div className="card-elegant rounded-3xl overflow-hidden relative aspect-[4/3] shadow-elegant group">
                <img
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"
                  alt="Layali Shami Ambiance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-start">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                    {lang === "ar" ? "أجواءنا الشامية" : "Our Heritage Ambiance"}
                  </span>
                  <h4 className="font-serif text-lg font-bold">
                    {lang === "ar" ? "ليالي الدمشقية الساحرة" : "Magical Shami Nights"}
                  </h4>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="card-elegant rounded-3xl p-6 space-y-4 bg-card text-start border border-border/40">
                <h4 className="font-serif text-base font-bold text-accent">
                  {lang === "ar" ? "معلومات هامة للحجز" : "Reservation Guidelines"}
                </h4>
                
                <div className="space-y-3.5">
                  <HighlightRow 
                    icon={ShieldCheck} 
                    title={lang === "ar" ? "تأكيد فوري" : "Instant Confirmation"}
                    desc={lang === "ar" ? "ستتلقى إيصال الحجز فورياً ورمزاً خاصاً بطاولتك." : "You will receive an instant digital receipt and a table code."}
                  />
                  <HighlightRow 
                    icon={ParkingCircle} 
                    title={lang === "ar" ? "خدمة اصطفاف السيارات" : "Valet Parking Available"}
                    desc={lang === "ar" ? "نوفر خدمة اصطفاف مجانية ومريحة لجميع ضيوفنا." : "We offer free and secured valet parking service for our guests."}
                  />
                  <HighlightRow 
                    icon={Users} 
                    title={lang === "ar" ? "جلسات عائلية وخصوصية" : "Family & Private Sections"}
                    desc={lang === "ar" ? "نوفر حواجز خصوصية وجلسات منفصلة مريحة جداً للعائلات." : "Separate partition zones are available for families upon request."}
                  />
                  <HighlightRow 
                    icon={UtensilsCrossed} 
                    title={lang === "ar" ? "قائمة أطعمة متنوعة" : "Dietary Accommodations"}
                    desc={lang === "ar" ? "أطباق مخصصة للنباتيين، وخيارات صحية وحارة تناسب ذوقك." : "We accommodate vegetarian, spicy, and allergy-related dietary needs."}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <ReservationReceipt details={successDetails} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper highlight row
function HighlightRow({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon className="w-4.5 h-4.5" />
      </span>
      <div className="space-y-0.5">
        <h5 className="text-xs md:text-sm font-bold text-foreground">{title}</h5>
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
