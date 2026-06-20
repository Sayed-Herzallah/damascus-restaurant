import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Home } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

// Read credentials from .env
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@layalishami.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function Auth() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    const session = localStorage.getItem("layali_admin_session");
    if (session === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      return lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    }
    if (!emailRegex.test(val)) {
      return lang === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email format";
    }
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val.trim()) {
      return lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    }
    if (val.length < 4) {
      return lang === "ar" ? "كلمة المرور قصيرة جداً (الحد الأدنى 4 رموز)" : "Password too short (min 4 characters)";
    }
    return "";
  };

  // Run validation reactively when values or language change (only after touch)
  useEffect(() => {
    if (touched.email) {
      const err = validateEmail(email);
      setErrors((p) => ({ ...p, email: err || undefined }));
    }
  }, [email, touched.email, lang]);

  useEffect(() => {
    if (touched.password) {
      const err = validatePassword(password);
      setErrors((p) => ({ ...p, password: err || undefined }));
    }
  }, [password, touched.password, lang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all inputs as touched to trigger full validation feedback
    setTouched({ email: true, password: true });
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr || undefined,
        password: passErr || undefined,
      });
      toast.error(
        lang === "ar" 
          ? "يرجى تصحيح أخطاء الإدخال أولاً" 
          : "Please correct input errors first"
      );
      return;
    }

    setLoading(true);
    // Simulate premium login request verification delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("layali_admin_session", "true");
      toast.success(lang === "ar" ? "تم تسجيل الدخول بنجاح ✓" : "Successfully signed in ✓");
      navigate("/admin");
    } else {
      toast.error(
        lang === "ar"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "Invalid email or password"
      );
      // Highlight inputs as red by setting custom errors
      setErrors({
        email: lang === "ar" ? "بيانات غير مطابقة" : "Incorrect email",
        password: lang === "ar" ? "بيانات غير مطابقة" : "Incorrect password"
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#0f0e0d] to-[#050505]"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background patterns and glowing orbs */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#bc381e]/8 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#e89d1c]/6 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      {/* Back to Home Button */}
      <div className={`absolute top-6 ${lang === "ar" ? "left-6" : "right-6"} z-20`}>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#12100e]/80 backdrop-blur-md border border-[#c5a880]/20 text-stone-300 hover:text-[#c5a880] hover:border-[#c5a880]/50 transition-all duration-300 text-sm shadow-lg hover:shadow-[#c5a880]/5"
        >
          <Home className="w-4 h-4 text-[#c5a880]" />
          <span>{lang === "ar" ? "الرئيسية" : "Home"}</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        {/* Glow effect surrounding the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bc381e]/35 to-[#e89d1c]/30 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative rounded-3xl p-8 md:p-10 bg-[#120f0d]/95 backdrop-blur-2xl border border-[#c5a880]/25 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center space-y-7">
          
          {/* Hexagonal / Rotating Circle Ornament for Logo */}
          <div className="relative inline-flex justify-center items-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#c5a880]/25 animate-[spin_40s_linear_infinite]" />
            <div className="absolute -inset-2.5 rounded-full border border-double border-[#c5a880]/20 animate-[spin_25s_linear_infinite_reverse]" />
            <div className="w-16 h-16 bg-gradient-to-br from-[#bc381e] to-[#e89d1c] rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(188,56,30,0.4)] relative z-10">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight bg-gradient-to-r from-[#c5a880] via-[#f7dfb9] to-[#e89d1c] bg-clip-text text-transparent">
              {lang === "ar" ? "بوابة الإدارة" : "Admin Dashboard"}
            </h1>
            <OrnamentDivider className="w-40 h-4 mx-auto text-[#c5a880]/60" small />
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              {lang === "ar" 
                ? "سجل الدخول بحساب المشرف للوصول إلى لوحة التحكم والتعديلات" 
                : "Sign in with admin account credentials to access dashboard manager"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-start" noValidate>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</span>
              </label>
              
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  placeholder={lang === "ar" ? "البريد الإلكتروني للإدارة" : "admin@layalishami.com"}
                  className={`bg-[#050403] border-stone-800/80 text-stone-200 placeholder:text-stone-700 h-12 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50 transition-all ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-950/10" 
                      : email && !errors.email && touched.email
                      ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30"
                      : ""
                  }`}
                />
                
                {errors.email && (
                  <div className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-red-500`}>
                    <AlertCircle className="w-4.5 h-4.5 text-red-500" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-red-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/20 mt-1.5 shadow-sm"
                  >
                    <span>{errors.email}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>{lang === "ar" ? "كلمة المرور" : "Password"}</span>
                </label>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  placeholder="ادخل كلمة المرور"
                  className={`bg-[#050403] border-stone-800/80 text-stone-200 placeholder:text-stone-700 h-12 pe-11 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50 transition-all ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30 bg-red-950/10" 
                      : password && !errors.password && touched.password
                      ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30"
                      : ""
                  }`}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors focus:outline-none`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-red-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/20 mt-1.5 shadow-sm"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{errors.password}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-6 bg-gradient-to-r from-[#bc381e] to-[#d44a2e] hover:from-[#d44a2e] hover:to-[#e05a3e] text-white font-bold text-sm shadow-lg shadow-[#bc381e]/20 transition-all duration-300 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {lang === "ar" ? "جاري التحقق والدخول..." : "Verifying access..."}
                </span>
              ) : (
                lang === "ar" ? "تسجيل الدخول" : "Sign In to Dashboard"
              )}
            </Button>
          </form>
          
        </div>
      </motion.div>
    </div>
  );
}

