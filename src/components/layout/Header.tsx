import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { t, lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = localStorage.getItem("layali_admin_session") === "true";

  const navCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary duration-200",
      isActive
        ? "text-primary after:absolute after:bottom-0 after:start-0 after:h-0.5 after:w-full after:bg-primary"
        : "text-foreground/80"
    );

  const mobileNavCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block py-3 px-4 rounded-lg text-base font-semibold transition-all duration-200",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground/80 hover:bg-muted hover:text-foreground"
    );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground font-bold shadow-soft group-hover:scale-105 transition-transform duration-300 font-serif text-lg">
            {lang === "ar" ? "ش" : "LS"}
          </span>
          <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-gradient-warm bg-gradient-warm">
            {t("hero.title")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navCls}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/menu" className={navCls}>
            {t("nav.menu")}
          </NavLink>
          <NavLink to="/contact" className={navCls}>
            {t("nav.service")}
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className={navCls}>
              {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
            </NavLink>
          ) : (
            <NavLink to="/auth" className={navCls}>
              {lang === "ar" ? "دخول الإدارة" : "Admin Login"}
            </NavLink>
          )}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors min-w-[40px] text-center"
            aria-label="Toggle language"
          >
            {lang === "en" ? "العربية" : "EN"}
          </button>

          {/* Reservation Button */}
          <Button asChild variant="warm" className="hidden sm:inline-flex" size="sm">
            <Link to="/reservations" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{t("nav.reservations")}</span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="container py-4 space-y-3">
            <NavLink to="/" end className={mobileNavCls} onClick={() => setIsOpen(false)}>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/menu" className={mobileNavCls} onClick={() => setIsOpen(false)}>
              {t("nav.menu")}
            </NavLink>
            <NavLink to="/contact" className={mobileNavCls} onClick={() => setIsOpen(false)}>
              {t("nav.service")}
            </NavLink>
            <NavLink to="/reservations" className={mobileNavCls} onClick={() => setIsOpen(false)}>
              {t("nav.reservations")}
            </NavLink>
            {isAdmin ? (
              <NavLink to="/admin" className={mobileNavCls} onClick={() => setIsOpen(false)}>
                {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
              </NavLink>
            ) : (
              <NavLink to="/auth" className={mobileNavCls} onClick={() => setIsOpen(false)}>
                {lang === "ar" ? "دخول الإدارة" : "Admin Login"}
              </NavLink>
            )}
            
            <div className="pt-2 border-t border-border/40 flex justify-stretch">
              <Button asChild variant="warm" className="w-full flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                <Link to="/reservations">
                  <CalendarDays className="w-4 h-4" />
                  <span>{t("nav.reservations")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
