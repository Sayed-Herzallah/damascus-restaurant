import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Users, MapPin, Clock, ArrowRight, ArrowLeft, Check, Building, SunDim, ChevronLeft, ChevronRight, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/context/LanguageContext";
import { ReservationDetails } from "./ReservationReceipt";
import { useReservations } from "@/context/ReservationContext";

type Props = {
  onSuccess: (details: ReservationDetails) => void;
};

export default function ReservationForm({ onSuccess }: Props) {
  const { t, lang } = useLang();
  const { addReservation } = useReservations();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form selections state
  const [guests, setGuests] = useState<string>("2");
  const [session, setSession] = useState<"indoor" | "outdoor">("indoor");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState("");

  // Calendar states
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());

  // Validation errors and touched fields
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateName = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "الاسم الثلاثي مطلوب" : "Full name is required";
    }
    if (val.trim().length < 3) {
      return lang === "ar" ? "الاسم يجب أن يكون 3 حروف على الأقل" : "Name must be at least 3 characters";
    }
    return "";
  };

  const validatePhone = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    }
    const phoneRegex = /^[0-9+\s-]+$/;
    if (!phoneRegex.test(val)) {
      return lang === "ar" ? "رقم الهاتف يجب أن يحتوي على أرقام وعلامات اتصال فقط" : "Phone number must contain only digits and valid symbols";
    }
    if (val.trim().replace(/[^0-9]/g, "").length < 7) {
      return lang === "ar" ? "رقم الهاتف قصير جداً (الحد الأدنى 7 أرقام)" : "Phone number is too short (min 7 digits)";
    }
    return "";
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return lang === "ar" ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address";
    }
    return "";
  };

  // Run validation on inputs change
  useEffect(() => {
    if (touched.name) {
      const err = validateName(name);
      setErrors((prev) => ({ ...prev, name: err }));
    }
  }, [name, touched.name, lang]);

  useEffect(() => {
    if (touched.phone) {
      const err = validatePhone(phone);
      setErrors((prev) => ({ ...prev, phone: err }));
    }
  }, [phone, touched.phone, lang]);

  useEffect(() => {
    if (touched.email) {
      const err = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: err }));
    }
  }, [email, touched.email, lang]);

  // Custom picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerPeriod, setPickerPeriod] = useState<"AM" | "PM">("PM");
  const [pickerHour, setPickerHour] = useState<string>("1");
  const [pickerMinute, setPickerMinute] = useState<string>("00");

  const parse24h = (timeStr: string) => {
    if (!timeStr) return { hour: "1", minute: "00", period: "PM" as const };
    const [h24, m] = timeStr.split(":");
    let hourVal = parseInt(h24);
    let period: "AM" | "PM" = "AM";
    if (hourVal >= 12) {
      period = "PM";
      if (hourVal > 12) hourVal -= 12;
    } else if (hourVal === 0) {
      hourVal = 12;
    }
    return { hour: String(hourVal), minute: m, period };
  };

  const convertTo24h = (h: string, m: string, period: "AM" | "PM"): string => {
    let hour = parseInt(h);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const hourStr = String(hour).padStart(2, "0");
    return `${hourStr}:${m}`;
  };

  const openTimePicker = () => {
    const { hour, minute, period } = parse24h(time);
    setPickerHour(hour);
    setPickerMinute(minute);
    setPickerPeriod(period);
    setShowTimePicker(true);
  };

  const monthNamesAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeekAr = ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
  const daysOfWeekEn = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Calendar days computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(calYear, calMonth, d));
    return days;
  }, [calMonth, calYear]);

  const isDateInPast = (d: Date | null) => {
    if (!d) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isDateSelected = (d: Date | null) => {
    if (!d || !date) return false;
    const sDate = new Date(date);
    return d.getDate() === sDate.getDate() && d.getMonth() === sDate.getMonth() && d.getFullYear() === sDate.getFullYear();
  };

  const isDateToday = (d: Date | null) => {
    if (!d) return false;
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const handlePrevMonth = () => {
    const today = new Date();
    if (calYear === today.getFullYear() && calMonth <= today.getMonth()) return;
    setCalMonth((prev) => {
      if (prev === 0) { setCalYear((y) => y - 1); return 11; }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalMonth((prev) => {
      if (prev === 11) { setCalYear((y) => y + 1); return 0; }
      return prev + 1;
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  // Time Slots
  const lunchSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
  const dinnerSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

  const formatTime12 = (slot: string) => {
    const [hStr, mStr] = slot.split(":");
    const h = parseInt(hStr);
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const suffix = h >= 12 ? (lang === "ar" ? "م" : "PM") : (lang === "ar" ? "ص" : "AM");
    return `${hour12}:${mStr} ${suffix}`;
  };

  // Seating
  const seatingDetails = {
    indoor: {
      titleEn: "Classic Indoor Hall",
      titleAr: "الصالة الداخلية الكلاسيكية",
      descEn: "Warm Levantine decor, family sections, cozy ambient lighting.",
      descAr: "ديكور شامي دافئ، جلسات عائلية مريحة، وإضاءة هادئة.",
      icon: Building
    },
    outdoor: {
      titleEn: "Al-Yasmine Outdoor Terrace",
      titleAr: "تراس الياسمين الخارجي",
      descEn: "Open-air dining under jasmine vines with soft music.",
      descAr: "تناول الطعام في الهواء الطلق تحت عرائش الياسمين.",
      icon: SunDim
    }
  };

  // Validation
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!guests) newErrors.guests = lang === "ar" ? "يرجى تحديد عدد الأفراد" : "Please select number of guests";
      if (!session) newErrors.session = lang === "ar" ? "يرجى اختيار منطقة الجلوس" : "Please select seating area";
    }
    if (currentStep === 2) {
      if (!date) newErrors.date = lang === "ar" ? "يرجى اختيار التاريخ" : "Please select date";
      else if (new Date(date) < new Date(todayStr)) newErrors.date = lang === "ar" ? "لا يمكن الحجز في تاريخ سابق" : "Date cannot be in the past";
      if (!time) newErrors.time = lang === "ar" ? "يرجى تحديد وقت الحجز" : "Please select a time slot";
    }
    if (currentStep === 3) {
      const nameErr = validateName(name);
      const phoneErr = validatePhone(phone);
      const emailErr = validateEmail(email);
      if (nameErr) newErrors.name = nameErr;
      if (phoneErr) newErrors.phone = phoneErr;
      if (emailErr) newErrors.email = emailErr;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 3) {
      setTouched({ name: true, phone: true, email: true });
    }
    if (validateStep(step)) setStep((prev) => prev + 1);
    else toast.error(lang === "ar" ? "يرجى تصحيح الأخطاء" : "Please fix errors to continue");
  };

  const handlePrevStep = () => { setErrors({}); setTouched({}); setStep((prev) => Math.max(1, prev - 1)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (!validateStep(3)) { toast.error(lang === "ar" ? "يرجى تصحيح أخطاء مدخلات الحجز أولاً" : "Please correct booking input errors first"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const refCode = `LS-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const tableCode = `T-${Math.floor(1 + Math.random() * 30)}`;
    const details: ReservationDetails = { name, email, phone, date, time, guests, session, requests, refCode, tableCode };
    addReservation(details);
    setSubmitting(false);
    toast.success(t("contact.success"));
    onSuccess(details);
  };

  const steps = [
    { num: 1, labelEn: "Area & Guests", labelAr: "المنطقة والأفراد", icon: Users },
    { num: 2, labelEn: "Date & Time", labelAr: "التاريخ والوقت", icon: CalendarDays },
    { num: 3, labelEn: "Your Info", labelAr: "البيانات الشخصية", icon: Check }
  ];

  // Formatted selected date for display
  const selectedDateFormatted = useMemo(() => {
    if (!date) return "";
    const d = new Date(date);
    const dayName = lang === "ar"
      ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][d.getDay()]
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
    const monthName = lang === "ar" ? monthNamesAr[d.getMonth()] : monthNamesEn[d.getMonth()];
    return `${dayName}، ${d.getDate()} ${monthName} ${d.getFullYear()}`;
  }, [date, lang]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Steps Progress */}
      <div className="flex justify-between items-center relative max-w-md mx-auto">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/40 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-warm z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => s.num < step && setStep(s.num)}
                disabled={s.num >= step}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                  step === s.num
                    ? "bg-card border-primary text-primary shadow-elegant scale-110"
                    : step > s.num
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border/60 text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>
              <span className="text-[10px] md:text-xs font-bold mt-2 text-foreground/80 whitespace-nowrap">
                {lang === "ar" ? s.labelAr : s.labelEn}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="card-elegant rounded-3xl p-6 md:p-8 bg-card relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ===== STEP 1 ===== */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: lang === "ar" ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === "ar" ? 25 : -25 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Seating */}
              <div className="space-y-3 text-start">
                <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{t("reservation.session")}</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {(["indoor", "outdoor"] as const).map((key) => {
                    const item = seatingDetails[key];
                    const Icon = item.icon;
                    const isSelected = session === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => { setSession(key); setErrors({}); }}
                        className={`p-5 rounded-2xl border text-start flex flex-col transition-all duration-300 cursor-pointer group ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-soft"
                            : "border-border/60 hover:border-accent bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary text-white" : "border-border"
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </div>
                        <h5 className="font-serif font-bold text-base">{lang === "ar" ? item.titleAr : item.titleEn}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{lang === "ar" ? item.descAr : item.descEn}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.session && <p className="text-red-500 text-xs font-semibold">{errors.session}</p>}
              </div>

              {/* Guest count */}
              <div className="space-y-3 text-start pt-2">
                <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <span>{t("reservation.guests")}</span>
                </h4>
                <div className="grid grid-cols-5 gap-2 max-w-md">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9-12", "13+"].map((count) => {
                    const isSelected = guests === count;
                    return (
                      <button
                        type="button"
                        key={count}
                        onClick={() => { setGuests(count); setErrors({}); }}
                        className={`py-2.5 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-soft scale-105"
                            : "border-border/60 hover:border-accent bg-card hover:bg-accent/5"
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
                {errors.guests && <p className="text-red-500 text-xs font-semibold">{errors.guests}</p>}
              </div>

              <div className="pt-6 border-t border-border/40 flex justify-end">
                <Button type="button" variant="warm" onClick={handleNextStep} className="flex items-center gap-2 px-8">
                  <span>{lang === "ar" ? "التالي" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2 ===== */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: lang === "ar" ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === "ar" ? 25 : -25 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative"
            >
              {/* Custom Date Picker */}
              <div className="space-y-3 text-start relative">
                <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  <span>{t("reservation.date")} *</span>
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    setShowTimePicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-start transition-all cursor-pointer bg-white dark:bg-stone-900 border-stone-250 dark:border-stone-800 hover:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-[0.99] ${
                    errors.date ? "border-red-500 ring-1 ring-red-500/20 bg-red-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-5 h-5 text-[#10b981]" />
                    <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                      {date ? selectedDateFormatted : (lang === "ar" ? "اختر تاريخ الحجز" : "Select date")}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${showDatePicker ? "rotate-180 text-[#10b981]" : ""}`} />
                </button>

                {errors.date && <p className="text-red-500 text-xs font-semibold px-2">{errors.date}</p>}

                {/* Calendar Card Modal Popup Overlay */}
                {showDatePicker && createPortal(
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDatePicker(false);
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
                  >
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4 text-center text-foreground cursor-default"
                    >
                      {/* Modal Header */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-serif font-bold text-sm text-foreground">
                          {lang === "ar" ? "اختر تاريخ الحجز" : "Select Reservation Date"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(false)}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                        >
                          {lang === "ar" ? "إغلاق" : "Close"}
                        </button>
                      </div>

                      <div dir="ltr">
                        {/* Month header */}
                        <div className="flex items-center justify-between px-2 py-1.5 mb-2 bg-muted/40 rounded-2xl">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground/75 transition-colors disabled:opacity-30 cursor-pointer font-bold"
                            disabled={calYear === new Date().getFullYear() && calMonth <= new Date().getMonth()}
                          >
                            <ChevronLeft className="w-4.5 h-4.5 rtl:rotate-180" />
                          </button>
                          <span className="font-serif font-extrabold text-sm text-foreground">
                            {lang === "ar" ? monthNamesAr[calMonth] : monthNamesEn[calMonth]} {calYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground/75 transition-colors cursor-pointer font-bold"
                          >
                            <ChevronRight className="w-4.5 h-4.5 rtl:rotate-180" />
                          </button>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-0 mb-1.5 border-b border-border/40 pb-1.5">
                          {(lang === "ar" ? daysOfWeekAr : daysOfWeekEn).map((dName, idx) => (
                            <span key={idx} className="text-[11px] font-bold text-muted-foreground/80 text-center py-1">
                              {dName}
                            </span>
                          ))}
                        </div>

                        {/* Days grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((dObj, idx) => {
                            if (!dObj) return <div key={`empty-${idx}`} className="aspect-square" />;
                            const isPast = isDateInPast(dObj);
                            const isSel = isDateSelected(dObj);
                            const isTod = isDateToday(dObj);
                            return (
                              <button
                                type="button"
                                key={`day-${dObj.getDate()}`}
                                disabled={isPast}
                                onClick={() => {
                                  const y = dObj.getFullYear();
                                  const m = String(dObj.getMonth() + 1).padStart(2, "0");
                                  const day = String(dObj.getDate()).padStart(2, "0");
                                  setDate(`${y}-${m}-${day}`);
                                  setErrors((prev) => ({ ...prev, date: "" }));
                                  setShowDatePicker(false);
                                }}
                                className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                  isSel
                                    ? "bg-[#10b981] text-white shadow-md scale-105"
                                    : isPast
                                    ? "text-muted-foreground/20 cursor-not-allowed"
                                    : isTod
                                    ? "border border-[#10b981] text-[#10b981]"
                                    : "hover:bg-emerald-50 hover:text-[#10b981] text-foreground/80"
                                }`}
                              >
                                {dObj.getDate()}
                              </button>
                            );
                          })}
                        </div>

                        {/* Bottom Row Actions */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/40 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setDate("");
                              setShowDatePicker(false);
                            }}
                            className="px-4 py-1.5 rounded-lg border border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50 transition-colors font-bold cursor-pointer"
                          >
                            {lang === "ar" ? "مسح" : "Clear"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const y = today.getFullYear();
                              const m = String(today.getMonth() + 1).padStart(2, "0");
                              const day = String(today.getDate()).padStart(2, "0");
                              setDate(`${y}-${m}-${day}`);
                              setCalMonth(today.getMonth());
                              setCalYear(today.getFullYear());
                              setShowDatePicker(false);
                            }}
                            className="px-4 py-1.5 rounded-lg border border-emerald-200 text-[#10b981] bg-emerald-50/50 hover:bg-emerald-50 transition-colors font-bold cursor-pointer"
                          >
                            {lang === "ar" ? "اليوم" : "Today"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Custom Time Picker */}
              <div className="space-y-3 text-start">
                <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{t("reservation.time")} *</span>
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    openTimePicker();
                    setShowDatePicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-start transition-all cursor-pointer bg-white dark:bg-stone-900 border-stone-250 dark:border-stone-800 hover:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-[0.99] ${
                    errors.time ? "border-red-500 ring-1 ring-red-500/20 bg-red-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-[#10b981]" />
                    <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                      {time ? formatTime12(time) : (lang === "ar" ? "اختر وقت الحجز" : "Select time")}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>

                {errors.time && <p className="text-red-500 text-xs font-semibold px-2">{errors.time}</p>}

                {/* Time Picker Modal Overlay Popup */}
                {showTimePicker && createPortal(
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTimePicker(false);
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
                  >
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5 text-center text-foreground cursor-default"
                    >
                      {/* AM / PM Toggle switch */}
                      <div className="grid grid-cols-2 p-1 bg-muted rounded-2xl border border-border/40">
                        <button
                          type="button"
                          onClick={() => setPickerPeriod("AM")}
                          className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            pickerPeriod === "AM"
                              ? "bg-[#10b981] text-white shadow-md"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lang === "ar" ? "صباحاً (ص)" : "AM"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerPeriod("PM")}
                          className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            pickerPeriod === "PM"
                              ? "bg-[#10b981] text-white shadow-md"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lang === "ar" ? "مساءً (م)" : "PM"}
                        </button>
                      </div>

                      {/* Hour selector section */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block text-start">
                          {lang === "ar" ? "الساعة" : "Hour"}
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((h) => {
                            const isSelected = pickerHour === h;
                            return (
                              <button
                                type="button"
                                key={`hour-${h}`}
                                onClick={() => setPickerHour(h)}
                                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? "bg-[#10b981] text-white shadow-md scale-105"
                                    : "bg-muted/50 hover:bg-muted text-foreground/80"
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Minute selector section */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block text-start">
                          {lang === "ar" ? "الدقيقة" : "Minute"}
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => {
                            const isSelected = pickerMinute === m;
                            return (
                              <button
                                type="button"
                                key={`minute-${m}`}
                                onClick={() => setPickerMinute(m)}
                                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? "bg-[#10b981] text-white shadow-md scale-105"
                                    : "bg-muted/50 hover:bg-muted text-foreground/80"
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const converted = convertTo24h(pickerHour, pickerMinute, pickerPeriod);
                            setTime(converted);
                            setErrors((prev) => ({ ...prev, time: "" }));
                            setShowTimePicker(false);
                          }}
                          className="w-full py-3.5 bg-[#10b981] hover:bg-[#0e9f6e] text-white font-bold rounded-2xl shadow-lg transition-colors cursor-pointer text-sm"
                        >
                          {lang === "ar" ? "تأكيد الوقت" : "Confirm Time"}
                        </button>
                      </div>
                    </motion.div>
                  </div>,
                  document.body
                )}
              </div>

              <div className="pt-6 border-t border-border/40 flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep} className="flex items-center gap-2 px-6">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === "ar" ? "السابق" : "Previous"}</span>
                </Button>
                <Button type="button" variant="warm" onClick={handleNextStep} className="flex items-center gap-2 px-8">
                  <span>{lang === "ar" ? "التالي" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3 ===== */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: lang === "ar" ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === "ar" ? 25 : -25 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-5 text-start"
              noValidate
            >
              {/* Summary Card */}
              <div className="bg-[#1c1814] border border-[#c5a880]/20 rounded-2xl p-5 space-y-3 shadow-lg">
                <h5 className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
                  {lang === "ar" ? "ملخص حجزك" : "Booking Summary"}
                </h5>
                <div className="grid grid-cols-2 gap-3 text-xs text-stone-200">
                  <span className="flex items-center gap-1.5 font-medium"><Users className="w-3.5 h-3.5 text-accent" /> {guests} {lang === "ar" ? "أفراد" : "guests"}</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-3.5 h-3.5 text-accent" /> {lang === "ar" ? (session === "indoor" ? "داخلي" : "خارجي") : session}</span>
                  <span className="flex items-center gap-1.5 font-medium"><CalendarDays className="w-3.5 h-3.5 text-accent" /> {selectedDateFormatted.split("،")[1]?.trim() || date}</span>
                  <span className="flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-accent" /> {time ? formatTime12(time) : "—"}</span>
                </div>
              </div>

              {/* Personal details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">{t("contact.name")} *</label>
                  <div className="relative">
                    <Input
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      placeholder={lang === "ar" ? "الاسم الثلاثي" : "Full Name"}
                      className={`h-12 rounded-xl bg-stone-50 dark:bg-stone-950/80 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium border-stone-250 dark:border-stone-800/80 ${
                        errors.name 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-500/5 dark:bg-red-950/10" 
                          : name && !errors.name && touched.name
                          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 dark:bg-emerald-950/5"
                          : ""
                      }`}
                    />
                    {errors.name && (
                      <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-1 shadow-sm"
                      >
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">{t("contact.phone")} *</label>
                  <div className="relative">
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                      placeholder={lang === "ar" ? "079 000 0000" : "+962 7 9000 0000"}
                      className={`h-12 rounded-xl bg-stone-50 dark:bg-stone-950/80 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium border-stone-250 dark:border-stone-800/80 ${
                        errors.phone 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-500/5 dark:bg-red-950/10" 
                          : phone && !errors.phone && touched.phone
                          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 dark:bg-emerald-950/5"
                          : ""
                      }`}
                    />
                    {errors.phone && (
                      <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-1 shadow-sm"
                      >
                        <span>{errors.phone}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">{t("contact.email")} *</label>
                  <div className="relative">
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      placeholder="email@example.com"
                      className={`h-12 rounded-xl bg-stone-50 dark:bg-stone-950/80 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium border-stone-250 dark:border-stone-800/80 ${
                        errors.email 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-500/5 dark:bg-red-950/10" 
                          : email && !errors.email && touched.email
                          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 dark:bg-emerald-950/5"
                          : ""
                      }`}
                    />
                    {errors.email && (
                      <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-1 shadow-sm"
                      >
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">{t("reservation.requests")}</label>
                <Textarea
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder={lang === "ar" ? "طلبات خاصة مثل كرسي أطفال، طاولة مميزة..." : "Special instructions, dietary needs..."}
                  rows={3}
                  className="rounded-xl bg-stone-50 dark:bg-stone-950/80 border-stone-250 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium p-4"
                />
              </div>

              <div className="pt-6 border-t border-border/40 flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep} className="flex items-center gap-2 px-6 h-11 rounded-xl font-bold">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === "ar" ? "السابق" : "Previous"}</span>
                </Button>
                <Button type="submit" variant="warm" disabled={submitting} className="flex items-center gap-2 px-8 h-11 rounded-xl font-extrabold shadow-lg">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("contact.sending")}
                    </span>
                  ) : (
                    <>
                      <span>{t("reservation.submit")}</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
