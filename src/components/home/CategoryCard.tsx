import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import OrnamentDivider from "@/components/shared/OrnamentDivider";
import { useLang } from "@/context/LanguageContext";

type Props = { icon: LucideIcon; title: string; href: string; delayMs?: number };

export default function CategoryCard({ icon: Icon, title, href, delayMs = 0 }: Props) {
  const { t } = useLang();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delayMs / 1000 }}
      className="h-full"
    >
      <Link
        to={href}
        className="card-elegant rounded-2xl p-8 text-center relative group overflow-hidden bg-card flex flex-col h-full items-center justify-between"
      >
        <CornerOrnament className="absolute top-3 start-3 w-8 h-8 text-accent/40" />
        <CornerOrnament className="absolute bottom-3 end-3 w-8 h-8 text-accent/40 rotate-180" />

        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-warm flex items-center justify-center shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
          <Icon className="w-9 h-9 text-primary-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold">{title}</h3>
          <OrnamentDivider className="mb-4" small />
        </div>
        
        <span className="inline-flex items-center gap-1.5 text-sm text-primary font-bold mt-4 group-hover:translate-x-1 lang-ar:group-hover:-translate-x-1 transition-transform">
          {t("menu.explore")} <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.div>
  );
}

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path d="M2 2 L2 14 M2 2 L14 2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 14 Q8 8 14 2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}
