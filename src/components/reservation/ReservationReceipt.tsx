import { CheckCircle2, Calendar, Clock, Users, MapPin, Printer, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export type ReservationDetails = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  session: "indoor" | "outdoor";
  requests?: string;
  refCode: string;
  tableCode: string;
};

type Props = {
  details: ReservationDetails;
  onReset: () => void;
};

export default function ReservationReceipt({ details, onReset }: Props) {
  const { t, lang } = useLang();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400 print:p-0 print:shadow-none print:bg-white print:text-black">
      {/* Success Banner */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground">
          {t("reservation.successTitle")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("reservation.successSubtitle")}
        </p>
      </div>

      {/* Elegant Receipt Card */}
      <div className="card-elegant rounded-2xl overflow-hidden bg-card border-accent/20 print:border print:border-black/20">
        {/* Receipt Header */}
        <div className="bg-gradient-warm px-6 py-6 text-white text-center print:bg-stone-100 print:text-black">
          <h3 className="font-serif text-xl font-bold tracking-wide">
            {t("reservation.receiptTitle")}
          </h3>
          <p className="text-xs opacity-85 mt-1 print:text-black/60">
            {t("reservation.refCode")}: <span className="font-mono font-bold text-sm tracking-wider">{details.refCode}</span>
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Details list */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-border/40 print:border-black/10">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block uppercase font-medium">
                {t("reservation.guestName")}
              </span>
              <span className="text-sm font-bold text-foreground">{details.name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block uppercase font-medium">
                {t("reservation.guestPhone")}
              </span>
              <span className="text-sm font-bold font-mono text-foreground">{details.phone}</span>
            </div>
            <div className="space-y-1 col-span-2 pt-2">
              <span className="text-xs text-muted-foreground block uppercase font-medium">
                {t("reservation.guestEmail")}
              </span>
              <span className="text-sm font-bold text-foreground">{details.email}</span>
            </div>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-start">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0 print:text-black" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {t("reservation.date")}
                </p>
                <p className="text-sm font-bold text-foreground">{details.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0 print:text-black" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {t("reservation.time")}
                </p>
                <p className="text-sm font-bold text-foreground">{details.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary shrink-0 print:text-black" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {t("reservation.guests")}
                </p>
                <p className="text-sm font-bold text-foreground">{details.guests}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 print:text-black" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                  {t("reservation.session")}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {details.session === "indoor"
                    ? t("reservation.sessionIndoor")
                    : t("reservation.sessionOutdoor")}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {details.requests && (
            <div className="pt-4 border-t border-border/40 print:border-black/10 text-start">
              <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">
                {t("reservation.requests")}
              </p>
              <p className="text-xs italic text-muted-foreground bg-muted/30 p-3 rounded-lg leading-relaxed print:bg-stone-50 print:text-black/80">
                {details.requests}
              </p>
            </div>
          )}

          {/* Table Code */}
          <div className="pt-4 border-t border-border/40 print:border-black/10 flex justify-between items-center text-xs opacity-75">
            <span>{t("reservation.tableCode")}</span>
            <span className="font-mono font-bold bg-muted px-2.5 py-0.5 rounded text-foreground">
              {details.tableCode}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex-1 flex items-center justify-center gap-2">
          <Printer className="w-4 h-4" />
          <span>{t("reservation.print")}</span>
        </Button>
        <Button onClick={onReset} variant="warm" className="flex-1 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("reservation.backHome")}</span>
        </Button>
      </div>
    </div>
  );
}
