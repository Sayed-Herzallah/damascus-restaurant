import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, LogOut, UtensilsCrossed, Plus, Edit2, Trash2, Search, Calendar, User, Phone, CheckCircle2, ShieldAlert, Star, Clock, AlertCircle, MessageSquare, MailOpen, Inbox } from "lucide-react";
import { toast } from "sonner";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";
import { useMenu, MenuItemWithCategory } from "@/context/MenuContext";
import { useReservations } from "@/context/ReservationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ActiveTab = "reservations" | "menu" | "messages";

export default function Admin() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { menuItems, categories, addItem, updateItem, deleteItem } = useMenu();
  const { reservations, deleteReservation } = useReservations();

  const [activeTab, setActiveTab] = useState<ActiveTab>("reservations");
  const [authorized, setAuthorized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const loadMessages = () => {
    try {
      const stored = localStorage.getItem("layali_admin_messages");
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error("Error loading messages:", e);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Custom Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteMessage = (id: string) => {
    triggerConfirm(
      lang === "ar" ? "حذف الرسالة" : "Delete Message",
      lang === "ar" ? "هل أنت متأكد من حذف هذه الرسالة نهائياً من الوارد؟" : "Are you sure you want to permanently delete this message from the inbox?",
      () => {
        try {
          const updated = messages.filter((msg) => msg.id !== id);
          setMessages(updated);
          localStorage.setItem("layali_admin_messages", JSON.stringify(updated));
          toast.success(lang === "ar" ? "تم حذف الرسالة بنجاح" : "Message deleted successfully");
        } catch (e) {
          console.error("Error deleting message:", e);
        }
      }
    );
  };

  // Search & Form States for Menu CRUD
  const [menuSearch, setMenuSearch] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItemWithCategory | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [catSlug, setCatSlug] = useState<any>("appetizers");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("4.5");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Check auth session
  useEffect(() => {
    const session = localStorage.getItem("layali_admin_session");
    if (session !== "true") {
      navigate("/auth");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  const handleSignOutClick = () => {
    triggerConfirm(
      lang === "ar" ? "تسجيل الخروج" : "Sign Out",
      lang === "ar" ? "هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟" : "Are you sure you want to sign out from the control panel?",
      () => {
        localStorage.removeItem("layali_admin_session");
        toast.success(lang === "ar" ? "تم تسجيل الخروج" : "Signed out successfully");
        navigate("/auth");
      }
    );
  };

  const handleEditClick = (item: MenuItemWithCategory) => {
    setEditingItem(item);
    setCatSlug(item.categorySlug);
    setNameEn(item.name_en);
    setNameAr(item.name_ar);
    setDescEn(item.description_en);
    setDescAr(item.description_ar);
    setPrice(item.price.toString());
    setRating((item.rating || 4.5).toString());
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    triggerConfirm(
      lang === "ar" ? "حذف الطبق" : "Delete Item",
      lang === "ar" ? "هل أنت متأكد من حذف هذا الطبق من قائمة الطعام نهائياً؟" : "Are you sure you want to permanently delete this item from the menu?",
      () => {
        deleteItem(id);
        toast.success(lang === "ar" ? "تم الحذف بنجاح" : "Item deleted successfully");
      }
    );
  };

  const handleCancelReservation = (refCode: string) => {
    triggerConfirm(
      lang === "ar" ? "إلغاء الحجز" : "Cancel Reservation",
      lang === "ar" ? `هل أنت متأكد من إلغاء الحجز ذو الكود المرجعي ${refCode}؟` : `Are you sure you want to cancel the booking with reference code ${refCode}?`,
      () => {
        deleteReservation(refCode);
        toast.success(lang === "ar" ? "تم إلغاء الحجز بنجاح" : "Booking canceled successfully");
      }
    );
  };

  const resetForm = () => {
    setEditingItem(null);
    setNameEn("");
    setNameAr("");
    setDescEn("");
    setDescAr("");
    setPrice("");
    setRating("4.5");
    setErrors({});
    setTouched({});
    setShowForm(false);
  };

  const validatePrice = (val: string) => {
    const pVal = parseFloat(val);
    if (!val.trim()) {
      return lang === "ar" ? "السعر مطلوب" : "Price is required";
    }
    if (isNaN(pVal) || pVal <= 0) {
      return lang === "ar" ? "السعر يجب أن يكون أكبر من 0" : "Price must be greater than 0";
    }
    return "";
  };

  const validateRating = (val: string) => {
    const rVal = parseFloat(val);
    if (!val.trim()) {
      return lang === "ar" ? "التقييم مطلوب" : "Rating is required";
    }
    if (isNaN(rVal) || rVal < 1 || rVal > 5) {
      return lang === "ar" ? "التقييم يجب أن يكون بين 1.0 و 5.0" : "Rating must be between 1.0 and 5.0";
    }
    return "";
  };

  const validateNameEn = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "الاسم بالإنجليزية مطلوب" : "English name is required";
    }
    if (val.length < 3) {
      return lang === "ar" ? "الاسم قصير جداً (الحد الأدنى 3 رموز)" : "Name is too short (min 3 characters)";
    }
    return "";
  };

  const validateNameAr = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "الاسم بالعربية مطلوب" : "Arabic name is required";
    }
    if (val.length < 3) {
      return lang === "ar" ? "الاسم قصير جداً (الحد الأدنى 3 رموز)" : "Name is too short (min 3 characters)";
    }
    return "";
  };

  // Run reactive validation on input changes once touched
  useEffect(() => {
    if (touched.price) {
      const err = validatePrice(price);
      setErrors((prev) => ({ ...prev, price: err }));
    }
  }, [price, touched.price, lang]);

  useEffect(() => {
    if (touched.rating) {
      const err = validateRating(rating);
      setErrors((prev) => ({ ...prev, rating: err }));
    }
  }, [rating, touched.rating, lang]);

  useEffect(() => {
    if (touched.nameEn) {
      const err = validateNameEn(nameEn);
      setErrors((prev) => ({ ...prev, nameEn: err }));
    }
  }, [nameEn, touched.nameEn, lang]);

  useEffect(() => {
    if (touched.nameAr) {
      const err = validateNameAr(nameAr);
      setErrors((prev) => ({ ...prev, nameAr: err }));
    }
  }, [nameAr, touched.nameAr, lang]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to trigger full validation feedback
    setTouched({
      price: true,
      rating: true,
      nameEn: true,
      nameAr: true,
    });

    const priceErr = validatePrice(price);
    const ratingErr = validateRating(rating);
    const nameEnErr = validateNameEn(nameEn);
    const nameArErr = validateNameAr(nameAr);

    if (priceErr || ratingErr || nameEnErr || nameArErr) {
      setErrors({
        price: priceErr,
        rating: ratingErr,
        nameEn: nameEnErr,
        nameAr: nameArErr,
      });
      toast.error(
        lang === "ar" 
          ? "يرجى تصحيح أخطاء مدخلات الطبق أولاً" 
          : "Please correct menu item form errors first"
      );
      return;
    }

    const pVal = parseFloat(price);
    const rVal = parseFloat(rating);

    const itemData = {
      name_en: nameEn,
      name_ar: nameAr,
      description_en: descEn,
      description_ar: descAr,
      price: pVal,
      categorySlug: catSlug,
      rating: rVal,
    };

    if (editingItem) {
      updateItem({
        ...itemData,
        id: editingItem.id,
      });
      toast.success(lang === "ar" ? "تم التعديل بنجاح" : "Item updated successfully");
    } else {
      addItem(itemData);
      toast.success(lang === "ar" ? "تم الإضافة بنجاح" : "Item added successfully");
    }

    resetForm();
  };

  // Filtered menu items for table
  const filteredMenuItems = menuItems.filter((item) => {
    const query = menuSearch.toLowerCase().trim();
    return (
      item.name_en.toLowerCase().includes(query) ||
      item.name_ar.includes(query) ||
      item.categorySlug.toLowerCase().includes(query)
    );
  });

  if (!authorized) return null;

  return (
    <div className="w-full bg-[#fdfdfc] dark:bg-[#080706] text-stone-800 dark:text-stone-200 py-12 min-h-screen relative overflow-hidden transition-colors duration-300 px-4 sm:px-6 md:px-8">
      {/* Background patterns and glowing spots */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-[#bc381e]/6 dark:bg-[#bc381e]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-[#e89d1c]/5 dark:bg-[#e89d1c]/4 rounded-full blur-[110px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-stone-200 dark:border-stone-800/80 pb-6 mb-10 text-start relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#bc381e] dark:text-[#c5a880] uppercase tracking-widest">{t("nav.admin")}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#bc381e] via-[#c5a880] to-[#e89d1c] dark:from-[#c5a880] dark:via-[#f7dfb9] dark:to-[#e89d1c] bg-clip-text text-transparent">
              {lang === "ar" ? "لوحة الإدارة والمتابعة" : "Control Panel Dashboard"}
            </h1>
          </div>

          <Button onClick={handleSignOutClick} variant="outline" className="flex items-center gap-2 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl h-11 px-5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-md dark:shadow-lg shadow-red-100/5 dark:shadow-red-950/20">
            <LogOut className="w-4 h-4" />
            <span>{t("nav.logout")}</span>
          </Button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-start relative z-10">
          <SummaryCard icon={CalendarDays} title={lang === "ar" ? "الحجوزات النشطة" : "Active Bookings"} value={reservations.length} variant="active" />
          <SummaryCard icon={UtensilsCrossed} title={lang === "ar" ? "عناصر القائمة" : "Menu Items"} value={menuItems.length} variant="default" />
          <SummaryCard icon={MessageSquare} title={lang === "ar" ? "الشكاوى والرسائل" : "Complaints & Messages"} value={messages.length} variant="warning" />
          <SummaryCard icon={CheckCircle2} title={lang === "ar" ? "حالة النظام" : "System Status"} value={lang === "ar" ? "متصل" : "Online"} variant="success" />
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 bg-stone-100 dark:bg-[#120f0d] border border-stone-200 dark:border-stone-800/80 p-1.5 rounded-2xl gap-1 sm:gap-2 mb-8 relative z-10 w-full max-w-2xl shadow-sm">
          <button
            onClick={() => {
              setActiveTab("reservations");
              resetForm();
            }}
            className={`py-2 px-1 sm:py-2.5 sm:px-5 font-serif text-[10px] sm:text-xs md:text-sm lg:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === "reservations"
                ? "bg-gradient-to-r from-[#bc381e] to-[#d44a2e] text-white shadow-lg shadow-[#bc381e]/15"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-900/40"
            }`}
          >
            <CalendarDays className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="text-center">{lang === "ar" ? "الحجوزات" : "Bookings"}</span>
          </button>
          
          <button
            onClick={() => setActiveTab("menu")}
            className={`py-2 px-1 sm:py-2.5 sm:px-5 font-serif text-[10px] sm:text-xs md:text-sm lg:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
              activeTab === "menu"
                ? "bg-gradient-to-r from-[#bc381e] to-[#d44a2e] text-white shadow-lg shadow-[#bc381e]/15"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-900/40"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="text-center">{lang === "ar" ? "قائمة الطعام" : "Menu"}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("messages");
              resetForm();
              loadMessages();
            }}
            className={`py-2 px-1 sm:py-2.5 sm:px-5 font-serif text-[10px] sm:text-xs md:text-sm lg:text-base font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 relative ${
              activeTab === "messages"
                ? "bg-gradient-to-r from-[#bc381e] to-[#d44a2e] text-white shadow-lg shadow-[#bc381e]/15"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-900/40"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="text-center">{lang === "ar" ? "الرسائل" : "Inbox"}</span>
            {messages.length > 0 && (
              <span className="absolute top-1 right-1 sm:relative sm:top-0 sm:right-0 bg-[#bc381e] text-white text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-pulse">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="relative z-10">
          {activeTab === "reservations" && (
            <div className="space-y-6 text-start">
              {reservations.length > 0 ? (
                <div className="grid gap-5">
                  {reservations.map((res) => (
                    <div key={res.refCode} className="rounded-3xl p-6 bg-gradient-to-br from-white to-stone-50/50 dark:from-[#120f0d] dark:to-[#0a0807] border border-stone-200 dark:border-stone-800/80 relative overflow-hidden flex flex-col md:flex-row justify-between gap-5 hover:border-[#c5a880]/50 dark:hover:border-[#c5a880]/30 transition-all duration-300 shadow-md hover:shadow-lg">
                      {/* Visual side bar */}
                      <div className={`absolute top-0 bottom-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1.5 bg-gradient-to-b from-[#bc381e] to-[#e89d1c]`} />
                      
                      <div className="space-y-4 ps-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-lg font-extrabold text-stone-900 dark:text-[#f7dfb9]">{res.name}</span>
                          <span className="font-mono text-xs bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[#bc381e] dark:text-[#c5a880] px-3 py-1 rounded-xl font-bold">{res.refCode}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            res.session === "indoor" 
                              ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-500" 
                              : "border-[#10b981]/20 bg-[#10b981]/5 text-[#10b981]"
                          }`}>
                            {res.session === "indoor" ? t("reservation.sessionIndoor") : t("reservation.sessionOutdoor")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 text-stone-700 dark:text-stone-200">
                            <Calendar className="w-4 h-4 shrink-0 text-emerald-600 dark:text-[#10b981]" />
                            <span>{res.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 text-stone-700 dark:text-stone-200">
                            <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-[#e89d1c]" />
                            <span>{res.time}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 text-stone-700 dark:text-stone-200">
                            <User className="w-4 h-4 shrink-0 text-[#9b7e56] dark:text-[#c5a880]" />
                            <span>{res.guests} {lang === "ar" ? "أفراد" : "Guests"}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 text-stone-700 dark:text-stone-200">
                            <Phone className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                            <span className="font-mono">{res.phone}</span>
                          </div>
                        </div>

                        {res.requests && (
                          <div className="text-xs text-stone-700 dark:text-stone-300 bg-stone-50/60 dark:bg-stone-950/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-850/80 max-w-2xl leading-relaxed mt-2">
                            <strong className="text-[#bc381e] dark:text-[#c5a880] font-bold block mb-1.5 not-italic uppercase tracking-wider text-[10px]">{t("reservation.requests")}:</strong>
                            <span>"{res.requests}"</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-stretch md:justify-end shrink-0 md:border-s border-stone-200 dark:border-stone-800/40 md:ps-6">
                        <Button onClick={() => handleCancelReservation(res.refCode)} variant="outline" className="w-full md:w-auto text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/15 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl h-11 px-5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-100/5 dark:shadow-red-950/30">
                          <Trash2 className="w-4.5 h-4.5 me-1.5" />
                          <span className="font-bold">{lang === "ar" ? "إلغاء الحجز" : "Cancel"}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-[#120f0d] border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md mx-auto shadow-xl">
                  <ShieldAlert className="w-14 h-14 text-stone-400 dark:text-stone-600 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-stone-800 dark:text-stone-300">{lang === "ar" ? "لا توجد حجوزات نشطة" : "No Active Reservations"}</h3>
                  <p className="text-xs text-stone-500 px-6 mt-2 leading-relaxed">
                    {lang === "ar" ? "ستظهر حجوزات طاولات الزوار هنا فور تقديمها." : "Reservations submitted by visitors will list here."}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "menu" && (
            <div className="space-y-8 text-start">
              {/* CRUD Form (Add / Edit) */}
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleFormSubmit}
                  className="rounded-3xl p-6 md:p-8 bg-white dark:bg-[#120f0d] border border-stone-200 dark:border-stone-800 space-y-6 shadow-2xl relative overflow-hidden"
                  noValidate
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#bc381e] via-[#e89d1c] to-[#c5a880]" />
                  <div className="flex items-center justify-between border-b border-stone-150 dark:border-stone-800 pb-4">
                    <h3 className="font-serif text-xl font-bold text-[#bc381e] dark:text-[#c5a880] flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#e89d1c]" />
                      <span>
                        {editingItem
                          ? (lang === "ar" ? "تعديل بيانات الطبق" : "Edit Menu Item")
                          : (lang === "ar" ? "إضافة طبق جديد بالقائمة" : "Add New Menu Item")}
                      </span>
                    </h3>
                    <button type="button" onClick={resetForm} className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer">
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "الفئة" : "Category"} *</label>
                      <Select
                        value={catSlug}
                        onChange={(e) => setCatSlug(e.target.value)}
                        className="h-12 rounded-xl bg-white dark:bg-stone-950/80 border-stone-250 dark:border-stone-800/80 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-stone-900 dark:text-stone-200 font-medium px-3 w-full"
                      >
                        <option value="appetizers">{lang === "ar" ? "مقبلات وسلطات" : "Appetizers"}</option>
                        <option value="eastern">{lang === "ar" ? "أطباق شرقية" : "Eastern Dishes"}</option>
                        <option value="sandwiches">{lang === "ar" ? "سندويشات صاج" : "Sandwiches"}</option>
                        <option value="western">{lang === "ar" ? "وجبات غربية" : "Western Meals"}</option>
                        <option value="desserts">{lang === "ar" ? "حلويات" : "Desserts"}</option>
                        <option value="drinks">{lang === "ar" ? "مشروبات" : "Beverages"}</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "السعر ($)" : "Price ($)"} *</label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value);
                            if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                          }}
                          onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
                          placeholder="12.99"
                          className={`h-12 rounded-xl bg-white dark:bg-stone-950/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium ${
                            errors.price 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-200" 
                              : price && !errors.price && touched.price
                              ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/5 text-stone-900 dark:text-stone-200"
                              : "border-stone-255 dark:border-stone-800/80"
                          }`}
                        />
                        {errors.price && (
                          <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.price && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-2 shadow-md"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
                            <span>{errors.price}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "التقييم (1 - 5)" : "Rating (1 - 5)"} *</label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          value={rating}
                          onChange={(e) => {
                            setRating(e.target.value);
                            if (errors.rating) setErrors((prev) => ({ ...prev, rating: "" }));
                          }}
                          onBlur={() => setTouched((prev) => ({ ...prev, rating: true }))}
                          placeholder="4.5"
                          className={`h-12 rounded-xl bg-white dark:bg-stone-950/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium ${
                            errors.rating 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-200" 
                              : rating && !errors.rating && touched.rating
                              ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/5 text-stone-900 dark:text-stone-200"
                              : "border-stone-255 dark:border-stone-800/80"
                          }`}
                        />
                        {errors.rating && (
                          <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.rating && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-2 shadow-md"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
                            <span>{errors.rating}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "الاسم بالإنجليزية" : "Name (English)"} *</label>
                      <div className="relative">
                        <Input
                          value={nameEn}
                          onChange={(e) => {
                            setNameEn(e.target.value);
                            if (errors.nameEn) setErrors((prev) => ({ ...prev, nameEn: "" }));
                          }}
                          onBlur={() => setTouched((prev) => ({ ...prev, nameEn: true }))}
                          placeholder="E.g., Shish Kebab"
                          className={`h-12 rounded-xl bg-white dark:bg-stone-950/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium ${
                            errors.nameEn 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-200" 
                              : nameEn && !errors.nameEn && touched.nameEn
                              ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/5 text-stone-900 dark:text-stone-200"
                              : "border-stone-255 dark:border-stone-800/80"
                          }`}
                        />
                        {errors.nameEn && (
                          <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.nameEn && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-2 shadow-md"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
                            <span>{errors.nameEn}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "الاسم بالعربية" : "Name (Arabic)"} *</label>
                      <div className="relative">
                        <Input
                          value={nameAr}
                          onChange={(e) => {
                            setNameAr(e.target.value);
                            if (errors.nameAr) setErrors((prev) => ({ ...prev, nameAr: "" }));
                          }}
                          onBlur={() => setTouched((prev) => ({ ...prev, nameAr: true }))}
                          placeholder="مثلاً: كباب مشوي على الفحم"
                          className={`h-12 rounded-xl bg-white dark:bg-stone-950/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium ${
                            errors.nameAr 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-200" 
                              : nameAr && !errors.nameAr && touched.nameAr
                              ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/5 text-stone-900 dark:text-stone-200"
                              : "border-stone-255 dark:border-stone-800/80"
                          }`}
                        />
                        {errors.nameAr && (
                          <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.nameAr && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            className="flex items-center gap-2 text-red-700 dark:text-red-200 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 mt-2 shadow-md"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
                            <span>{errors.nameAr}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "الوصف بالإنجليزية" : "Description (English)"}</label>
                      <Textarea
                        rows={2}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Describe the item in English..."
                        className="rounded-xl bg-white dark:bg-stone-950/80 border-stone-200 dark:border-stone-800/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium p-4"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">{lang === "ar" ? "الوصف بالعربية" : "Description (Arabic)"}</label>
                      <Textarea
                        rows={2}
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        placeholder="اكتب وصفاً للطبق بالعربية..."
                        className="rounded-xl bg-white dark:bg-stone-950/80 border-stone-200 dark:border-stone-800/80 text-stone-900 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-700 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all font-medium p-4"
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-stone-150 dark:border-stone-800 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl px-5 h-11 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-bold">
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button type="submit" variant="warm" className="rounded-xl px-6 h-11 font-bold bg-gradient-to-r from-[#bc381e] to-[#d44a2e] text-white hover:from-[#d44a2e] hover:to-[#e05a3e] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg shadow-[#bc381e]/15">
                      {lang === "ar" ? "حفظ وتثبيت" : "Save Changes"}
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Menu List & Search Bar */}
              <div className="bg-white dark:bg-[#120f0d] border border-stone-200 dark:border-stone-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Search */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
                    <Input
                      placeholder={lang === "ar" ? "بحث في القائمة..." : "Search menu..."}
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="ps-9 bg-white dark:bg-stone-950/80 border-stone-200 dark:border-stone-800 focus:border-[#c5a880] text-stone-900 dark:text-stone-200 h-11 rounded-xl w-full"
                    />
                  </div>

                  {/* Add new button */}
                  {!showForm && (
                    <Button onClick={() => setShowForm(true)} variant="warm" className="flex items-center gap-1.5 h-11 font-bold shrink-0 rounded-xl bg-gradient-to-r from-[#bc381e] to-[#d44a2e] hover:from-[#d44a2e] hover:to-[#e05a3e] text-white shadow-lg shadow-[#bc381e]/15 px-5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]">
                      <Plus className="w-4.5 h-4.5" />
                      <span>{lang === "ar" ? "إضافة طبق" : "Add Item"}</span>
                    </Button>
                  )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-850/80 bg-stone-50/30 dark:bg-stone-950/20 shadow-inner">
                  <table className="w-full text-sm text-start border-collapse">
                    <thead>
                      <tr className="bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-850/80 text-stone-600 dark:text-stone-300 font-bold uppercase text-[10px] md:text-xs tracking-wider">
                        <th className="px-5 py-4 text-start font-bold">{lang === "ar" ? "الاسم" : "Name"}</th>
                        <th className="px-5 py-4 text-start font-bold">{lang === "ar" ? "الفئة" : "Category"}</th>
                        <th className="px-5 py-4 text-start font-bold">{lang === "ar" ? "السعر" : "Price"}</th>
                        <th className="px-5 py-4 text-center w-28 font-bold">{lang === "ar" ? "العمليات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((item) => (
                          <tr key={item.id} className="border-b border-stone-150 dark:border-stone-850/60 last:border-0 hover:bg-stone-100/50 dark:hover:bg-stone-900/40 transition-colors duration-200">
                            <td className="px-5 py-4 text-start">
                              <div className="font-bold text-stone-900 dark:text-stone-100 font-serif text-base">{lang === "ar" ? item.name_ar : item.name_en}</div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-xs md:max-w-md mt-0.5">
                                {lang === "ar" ? item.description_ar : item.description_en}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-start uppercase text-xs tracking-wider text-[#bc381e] dark:text-[#c5a880] font-bold">
                              {item.categorySlug}
                            </td>
                            <td className="px-5 py-4 text-start font-mono font-black text-base text-[#be7d0a] dark:text-[#e89d1c]">
                              ${item.price}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEditClick(item)} className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#c5a880] text-stone-700 dark:text-stone-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.93] cursor-pointer" title={lang === "ar" ? "تعديل" : "Edit"}>
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteClick(item.id)} className="p-2 rounded-xl bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-500/20 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.93] cursor-pointer" title={lang === "ar" ? "حذف" : "Delete"}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-stone-400 dark:text-stone-500 text-xs">
                            {lang === "ar" ? "لا توجد أطباق تطابق بحثك" : "No items match your search"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6 text-start relative z-10">
              {messages.length > 0 ? (
                <div className="grid gap-5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-3xl p-6 bg-gradient-to-br from-white to-stone-50/50 dark:from-[#120f0d] dark:to-[#0a0807] border border-stone-200 dark:border-stone-800/80 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 hover:border-[#c5a880]/50 dark:hover:border-[#c5a880]/30 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {/* Glowing status line depending on contact vs complaint */}
                      <div
                        className={`absolute top-0 bottom-0 ${lang === "ar" ? "right-0" : "left-0"} w-1.5 ${
                          msg.type === "complaint" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-[#c5a880]"
                        }`}
                      />

                      <div className="space-y-4 ps-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-lg font-extrabold text-stone-900 dark:text-stone-100">
                            {msg.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                              msg.type === "complaint"
                                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400"
                                : "border-[#c5a880]/30 bg-[#c5a880]/10 text-amber-800 dark:border-[#c5a880]/20 dark:bg-[#c5a880]/5 dark:text-[#c5a880]"
                            }`}
                          >
                            {msg.type === "complaint"
                              ? (lang === "ar" ? "شكوى" : "Complaint")
                              : (lang === "ar" ? "خدمة عملاء" : "Customer Inquiry")}
                          </span>
                          {msg.subject && (
                            <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-1 rounded-xl">
                              {lang === "ar" ? "الموضوع: " : "Subject: "}
                              {msg.subject}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-500 dark:text-stone-400">
                          <div className="flex items-center gap-2 font-semibold">
                            <Phone className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            <span className="font-mono text-stone-700 dark:text-stone-350">{msg.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 font-semibold">
                            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="text-stone-700 dark:text-stone-350">{msg.date}</span>
                          </div>
                        </div>

                        <div className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed bg-stone-50/60 dark:bg-stone-950/80 p-5 rounded-2xl border border-stone-200 dark:border-stone-850/80 max-w-4xl shadow-inner mt-2">
                          {msg.message}
                        </div>
                      </div>

                      <div className="flex items-center justify-stretch md:justify-end shrink-0 md:border-s border-stone-200 dark:border-stone-800/40 md:ps-6">
                        <Button
                          onClick={() => handleDeleteMessage(msg.id)}
                          variant="outline"
                          className="w-full md:w-auto text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/15 hover:bg-red-650 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl h-11 px-5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-100/5 dark:shadow-red-950/30"
                        >
                          <Trash2 className="w-4.5 h-4.5 me-1.5" />
                          <span className="font-bold">
                            {lang === "ar" ? "حذف الرسالة" : "Dismiss Message"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-[#120f0d] border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md mx-auto shadow-xl">
                  <MessageSquare className="w-14 h-14 text-stone-400 dark:text-stone-600 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-stone-800 dark:text-stone-300">
                    {lang === "ar" ? "البريد الوارد فارغ" : "Inbox is Empty"}
                  </h3>
                  <p className="text-xs text-stone-500 px-6 mt-2 leading-relaxed">
                    {lang === "ar"
                      ? "لا توجد رسائل أو شكاوى جديدة من العملاء حالياً."
                      : "No new messages or customer complaints at the moment."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog Portal */}
      {createPortal(
        <AnimatePresence>
          {confirmDialog.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="fixed inset-0 bg-stone-950/60 backdrop-blur-md"
              />
              {/* Dialog Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0f0c0a] p-6 shadow-2xl z-[101] text-start transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-[#bc381e] dark:text-red-400 border border-red-100 dark:border-red-900/30 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                      {confirmDialog.title}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                      {confirmDialog.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 border-t border-stone-100 dark:border-stone-800/80 pt-4">
                  <Button
                    onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="px-5 h-11 rounded-xl border border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] font-bold text-sm cursor-pointer"
                  >
                    {lang === "ar" ? "تراجع" : "Cancel"}
                  </Button>
                  <Button
                    onClick={confirmDialog.onConfirm}
                    variant="warm"
                    className="px-6 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white hover:from-red-700 hover:to-red-800 dark:bg-red-600 dark:hover:bg-red-500 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] font-bold text-sm shadow-md shadow-red-600/15 cursor-pointer"
                  >
                    {lang === "ar" ? "تأكيد" : "Confirm"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Summary Card sub-component
function SummaryCard({ icon: Icon, title, value, variant = "default" }: { icon: any; title: string; value: string | number; variant?: "default" | "active" | "success" | "warning" }) {
  const colors = {
    default: {
      bg: "bg-[#c5a880]/10 border-[#c5a880]/20 text-[#8c6b3e] dark:text-[#c5a880]",
      glow: "hover:border-[#c5a880]/30 hover:shadow-[0_0_20px_rgba(197,168,128,0.08)]",
    },
    active: {
      bg: "bg-[#e89d1c]/10 border-[#e89d1c]/20 text-[#a06a0c] dark:text-[#e89d1c]",
      glow: "hover:border-[#e89d1c]/30 hover:shadow-[0_0_20px_rgba(232,157,28,0.08)]",
    },
    success: {
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      glow: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
      glow: "hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    }
  };

  const activeColor = colors[variant];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card-elegant rounded-2xl p-5 bg-card flex items-center justify-between shadow-soft transition-all duration-300 ${activeColor.glow}`}
    >
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="font-serif text-2xl md:text-3xl font-black text-foreground tracking-tight">{value}</p>
      </div>
      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${activeColor.bg}`}>
        <Icon className="w-5.5 h-5.5" />
      </span>
    </motion.div>
  );
}
