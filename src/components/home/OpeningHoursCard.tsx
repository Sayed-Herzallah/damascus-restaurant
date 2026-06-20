import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import OrnamentDivider from "@/components/shared/OrnamentDivider";

export default function OpeningHoursCard() {
  const { t } = useLang();
  const [isOpenNow, setIsOpenNow] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      // Open from 12:00 PM (12) to 12:00 AM (24/0)
      // Since hours are 0-23:
      // Open if hour is between 12 and 23 inclusive.
      setIsOpenNow(currentHour >= 12 && currentHour < 24);
    };

    checkOpenStatus();
    // Re-check every minute
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container pb-24 relative overflow-hidden transition-colors duration-300">
      <div className="card-elegant rounded-2xl p-10 text-center max-w-2xl mx-auto bg-card relative">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        
        <h3 className="font-serif text-3xl font-bold mb-2 text-foreground">
          {t("hours.title")}
        </h3>
        
        <OrnamentDivider className="mb-4" small />
        
        <p className="text-muted-foreground text-base mb-6">
          {t("hours.body")}
        </p>

        {/* Dynamic Open/Closed Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm">
          {isOpenNow ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50/20" />
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                {t("hours.openNow")}
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-rose-500 fill-rose-50/20" />
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                {t("hours.closedNow")}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
