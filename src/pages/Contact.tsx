import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, AlertCircle, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

type Tab = "contact" | "complaint" | "faq";

type FaqItem = {
  q: string;
  a: string;
};

export default function Contact() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("contact");
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  // Complaint Form State
  const [complaintName, setComplaintName] = useState("");
  const [complaintPhone, setComplaintPhone] = useState("");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [complaintErrors, setComplaintErrors] = useState<Record<string, string>>({});

  // Validate Contact Form
  const validateContact = (): boolean => {
    const errors: Record<string, string> = {};
    if (!contactName || contactName.trim().length < 3) {
      errors.name = lang === "ar" ? "الاسم يجب أن يكون 3 حروف على الأقل" : "Name must be at least 3 characters";
    }
    if (!contactPhone || contactPhone.trim().length < 7) {
      errors.phone = lang === "ar" ? "رقم الهاتف يجب أن يتكون من 7 أرقام على الأقل" : "Phone must be at least 7 digits";
    }
    if (!contactMessage || contactMessage.trim().length < 10) {
      errors.message = lang === "ar" ? "الرسالة يجب أن تحتوي على 10 أحرف على الأقل" : "Message must be at least 10 characters";
    }
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Complaint Form
  const validateComplaint = (): boolean => {
    const errors: Record<string, string> = {};
    if (!complaintName || complaintName.trim().length < 3) {
      errors.name = lang === "ar" ? "الاسم يجب أن يكون 3 حروف على الأقل" : "Name must be at least 3 characters";
    }
    if (!complaintPhone || complaintPhone.trim().length < 7) {
      errors.phone = lang === "ar" ? "رقم الهاتف يجب أن يتكون من 7 أرقام على الأقل" : "Phone must be at least 7 digits";
    }
    if (!complaintSubject || complaintSubject.trim().length < 3) {
      errors.subject = lang === "ar" ? "الموضوع يجب أن يكون 3 حروف على الأقل" : "Subject must be at least 3 characters";
    }
    if (!complaintDetails || complaintDetails.trim().length < 10) {
      errors.details = lang === "ar" ? "تفاصيل الشكوى يجب أن تحتوي على 10 أحرف على الأقل" : "Details must be at least 10 characters";
    }
    setComplaintErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit contact message
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateContact()) {
      toast.error(lang === "ar" ? "يرجى تعبئة الحقول بشكل صحيح" : "Please fill in the fields correctly");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    
    // Save contact message to localStorage
    try {
      const existing = localStorage.getItem("layali_admin_messages");
      const messages = existing ? JSON.parse(existing) : [];
      const newMsg = {
        id: "msg_" + Math.random().toString(36).substring(2, 9),
        type: "contact",
        name: contactName,
        phone: contactPhone,
        message: contactMessage,
        date: new Date().toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      messages.unshift(newMsg); // Add to the beginning
      localStorage.setItem("layali_admin_messages", JSON.stringify(messages));
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setSubmitting(false);
    
    // Reset Form
    setContactName("");
    setContactPhone("");
    setContactMessage("");
    setContactErrors({});
    
    toast.success(t("contact.successContact"));
  };

  // Submit complaint
  const handleComplaintSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateComplaint()) {
      toast.error(lang === "ar" ? "يرجى تعبئة الحقول بشكل صحيح" : "Please fill in the fields correctly");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    
    // Save complaint message to localStorage
    try {
      const existing = localStorage.getItem("layali_admin_messages");
      const messages = existing ? JSON.parse(existing) : [];
      const newMsg = {
        id: "msg_" + Math.random().toString(36).substring(2, 9),
        type: "complaint",
        name: complaintName,
        phone: complaintPhone,
        subject: complaintSubject,
        message: complaintDetails,
        date: new Date().toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      messages.unshift(newMsg); // Add to the beginning
      localStorage.setItem("layali_admin_messages", JSON.stringify(messages));
    } catch (err) {
      console.error("Error saving complaint:", err);
    }

    setSubmitting(false);
    
    // Reset Form
    setComplaintName("");
    setComplaintPhone("");
    setComplaintSubject("");
    setComplaintDetails("");
    setComplaintErrors({});
    
    toast.success(t("contact.successComplaint"));
  };

  const faqs: FaqItem[] = [
    { q: lang === "ar" ? "هل تقدمون خدمة التوصيل؟" : "Do you offer delivery?", a: lang === "ar" ? "نعم، نوفر خدمة توصيل لجميع المناطق المجاورة." : "Yes, we deliver to all nearby areas." },
    { q: lang === "ar" ? "هل تقبلون الحجوزات للمناسبات؟" : "Do you accept event bookings?", a: lang === "ar" ? "بالتأكيد، يمكنكم الحجز عبر صفحة التواصل أو هاتفيًا." : "Absolutely — book through our contact page or by phone." },
    { q: lang === "ar" ? "هل لديكم خيارات نباتية؟" : "Do you have vegetarian options?", a: lang === "ar" ? "نعم، تحتوي قائمتنا على تشكيلة واسعة من الأطباق النباتية." : "Yes, our menu features a wide selection of vegetarian dishes." },
    { q: lang === "ar" ? "ما هي ساعات العمل؟" : "What are your opening hours?", a: lang === "ar" ? "نفتح يوميًا من 12 ظهرًا حتى 12 منتصف الليل." : "We open daily from 12:00 noon to 12:00 midnight." },
    { q: lang === "ar" ? "هل يوجد قسم عائلي؟" : "Is there a family section?", a: lang === "ar" ? "نعم، لدينا قسم عائلي مريح ومخصص." : "Yes, we have a comfortable dedicated family section." },
  ];

  return (
    <div className="container py-16 transition-colors duration-300">
      {/* Page Header */}
      <header className="text-center mb-12 space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
          {t("contact.title")}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-warm bg-gradient-warm">
          {t("contact.title")}
        </h1>
        <OrnamentDivider className="max-w-md mx-auto" />
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          {t("contact.subtitle")}
        </p>
      </header>

      {/* Info Rows Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
        <InfoCard icon={MapPin} title={t("contact.address")} body={t("contact.addressVal")} />
        <InfoCard icon={Phone} title={lang === "ar" ? "الهاتف" : "Phone"} body="+962 7 0000 0000" />
        <InfoCard icon={Mail} title={lang === "ar" ? "البريد الإلكتروني" : "Email"} body="hello@layalishami.com" />
        <InfoCard icon={Clock} title={t("hours.title")} body={t("hours.body")} />
      </div>

      {/* Tabs list */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-muted p-1 rounded-xl grid grid-cols-3 w-full border border-border/40">
          {(["contact", "complaint", "faq"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "contact"
                ? t("contact.tabContact")
                : tab === "complaint"
                ? t("contact.tabComplaint")
                : t("contact.tabFaq")}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "contact" && (
            <motion.form
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleContactSubmit}
              className="card-elegant rounded-2xl p-6 md:p-8 space-y-5 bg-card text-start animate-in fade-in duration-300"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.name")}</label>
                <Input
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (contactErrors.name) setContactErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                  className={contactErrors.name ? "border-red-500 focus:ring-red-500" : ""}
                />
                {contactErrors.name && <p className="text-red-500 text-xs font-semibold">{contactErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.phone")}</label>
                <Input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (contactErrors.phone) setContactErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                  className={contactErrors.phone ? "border-red-500 focus:ring-red-500" : ""}
                />
                {contactErrors.phone && <p className="text-red-500 text-xs font-semibold">{contactErrors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.message")}</label>
                <Textarea
                  value={contactMessage}
                  onChange={(e) => {
                    setContactMessage(e.target.value);
                    if (contactErrors.message) setContactErrors((prev) => ({ ...prev, message: "" }));
                  }}
                  rows={5}
                  placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                  className={contactErrors.message ? "border-red-500 focus:ring-red-500" : ""}
                />
                {contactErrors.message && <p className="text-red-500 text-xs font-semibold">{contactErrors.message}</p>}
              </div>
              <Button type="submit" variant="warm" size="lg" disabled={submitting} className="w-full flex items-center justify-center gap-2 cursor-pointer">
                <span>{submitting ? t("contact.sending") : t("contact.send")}</span>
                {!submitting && <Send className="w-4 h-4" />}
              </Button>
            </motion.form>
          )}

          {activeTab === "complaint" && (
            <motion.form
              key="complaint"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleComplaintSubmit}
              className="card-elegant rounded-2xl p-6 md:p-8 space-y-5 bg-card text-start animate-in fade-in duration-300"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.name")}</label>
                <Input
                  value={complaintName}
                  onChange={(e) => {
                    setComplaintName(e.target.value);
                    if (complaintErrors.name) setComplaintErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                  className={complaintErrors.name ? "border-red-500 focus:ring-red-500" : ""}
                />
                {complaintErrors.name && <p className="text-red-500 text-xs font-semibold">{complaintErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.phone")}</label>
                <Input
                  type="tel"
                  value={complaintPhone}
                  onChange={(e) => {
                    setComplaintPhone(e.target.value);
                    if (complaintErrors.phone) setComplaintErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                  className={complaintErrors.phone ? "border-red-500 focus:ring-red-500" : ""}
                />
                {complaintErrors.phone && <p className="text-red-500 text-xs font-semibold">{complaintErrors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.subject")}</label>
                <Input
                  value={complaintSubject}
                  onChange={(e) => {
                    setComplaintSubject(e.target.value);
                    if (complaintErrors.subject) setComplaintErrors((prev) => ({ ...prev, subject: "" }));
                  }}
                  placeholder={lang === "ar" ? "موضوع الشكوى" : "Complaint Subject"}
                  className={complaintErrors.subject ? "border-red-500 focus:ring-red-500" : ""}
                />
                {complaintErrors.subject && <p className="text-red-500 text-xs font-semibold">{complaintErrors.subject}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/90">{t("contact.details")}</label>
                <Textarea
                  value={complaintDetails}
                  onChange={(e) => {
                    setComplaintDetails(e.target.value);
                    if (complaintErrors.details) setComplaintErrors((prev) => ({ ...prev, details: "" }));
                  }}
                  rows={5}
                  placeholder={lang === "ar" ? "يرجى ذكر تفاصيل الشكوى..." : "Please describe details here..."}
                  className={complaintErrors.details ? "border-red-500 focus:ring-red-500" : ""}
                />
                {complaintErrors.details && <p className="text-red-500 text-xs font-semibold">{complaintErrors.details}</p>}
              </div>
              <Button type="submit" variant="warm" size="lg" disabled={submitting} className="w-full flex items-center justify-center gap-2 cursor-pointer">
                <span>{submitting ? t("contact.sending") : t("contact.send")}</span>
                {!submitting && <AlertCircle className="w-4.5 h-4.5" />}
              </Button>
            </motion.form>
          )}

          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="card-elegant rounded-2xl p-6 md:p-8 bg-card space-y-4 text-start"
            >
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-border/40 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-2 flex items-center justify-between font-serif text-base font-bold text-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4.5 h-4.5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-sm text-muted-foreground leading-relaxed pt-2"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Google Maps Visual Placeholder */}
      <div className="max-w-5xl mx-auto mt-16">
        <h3 className="font-serif text-2xl font-bold mb-6 text-center">
          {lang === "ar" ? "موقعنا الجغرافي" : "Find Us"}
        </h3>
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden card-elegant bg-stone-900 border-accent/20 flex flex-col items-center justify-center p-6 text-center text-white">
          {/* Decorative outline representing map grid */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/80 to-stone-950 pointer-events-none" />

          {/* Golden Pin */}
          <div className="w-14 h-14 bg-gradient-warm rounded-full flex items-center justify-center text-white shadow-glow mb-4 animate-bounce relative z-10">
            <MapPin className="w-6.5 h-6.5 text-white" />
          </div>
          
          <div className="relative z-10 space-y-2">
            <h4 className="font-serif text-xl font-bold text-white">
              {t("hero.title")}
            </h4>
            <p className="text-sm text-stone-300 max-w-sm">
              {t("contact.addressVal")}
            </p>
            <p className="text-xs text-accent font-semibold uppercase tracking-widest pt-2">
              {lang === "ar" ? "مفتوح يومياً لخدمتكم" : "Welcome daily"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Card helper
function InfoCard({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="card-elegant rounded-2xl p-6 flex flex-col items-center text-center bg-card shadow-soft">
      <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shrink-0 shadow-sm">
        <Icon className="w-5.5 h-5.5" />
      </span>
      <h4 className="font-serif text-base font-bold text-foreground mb-1">{title}</h4>
      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{body}</p>
    </div>
  );
}
