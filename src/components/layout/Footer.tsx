import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t, lang } = useLang();

  const quickLinks = [
    { to: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
    { to: "/menu", label: t("nav.menu") },
    { to: "/reservations", label: t("nav.reservations") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="relative mt-0 bg-[#0f0c0a] text-stone-300 border-t border-[#c5a880]/20">
      {/* Top gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c5a880]/60 to-transparent" />

      <div className="container py-10">
        {/* Main grid - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">

          {/* Brand + About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#bc381e] to-[#e89d1c] flex items-center justify-center text-white font-serif text-sm font-black shrink-0">
                {lang === "ar" ? "ش" : "LS"}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#c5a880]">
                {t("hero.title")}
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
              {t("footer.desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-stone-400 hover:text-[#c5a880] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <span className="font-mono">+962 7 0000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <span className="truncate">{t("contact.addressVal")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <span>{lang === "ar" ? "يومياً 12م - 12ص" : "Daily 12PM - 12AM"}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#c5a880] uppercase tracking-wider">
              {lang === "ar" ? "تابعنا على" : "Follow Us"}
            </h4>
            <div className="flex gap-2 pt-1">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/mahmutqatar94/", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 hover:border-[#c5a880] text-stone-400 hover:text-white hover:bg-[#bc381e] flex items-center justify-center transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} {t("hero.title")} — {t("footer.rights")}</p>
          <div className="flex gap-3">
            <Link to="/menu" className="hover:text-[#c5a880] transition-colors">{t("nav.menu")}</Link>
            <Link to="/reservations" className="hover:text-[#c5a880] transition-colors">{t("nav.reservations")}</Link>
            <Link to="/contact" className="hover:text-[#c5a880] transition-colors">{t("nav.contact")}</Link>
            <Link to="/auth" className="hover:text-[#c5a880] transition-colors font-bold border-s border-stone-850 ps-3">{lang === "ar" ? "لوحة الإدارة" : "Admin Panel"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
