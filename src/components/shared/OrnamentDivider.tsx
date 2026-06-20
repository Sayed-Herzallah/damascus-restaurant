import { cn } from "@/lib/utils";

export default function OrnamentDivider({ className, small = false }: { className?: string; small?: boolean }) {
  return (
    <div className={cn("ornament-divider", className)}>
      <svg
        viewBox="0 0 200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={small ? "w-20 h-4" : "w-32 h-6"}
        aria-hidden="true"
      >
        <path d="M0 12 H70" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M130 12 H200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M100 2 L108 12 L100 22 L92 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="100" cy="12" r="2.5" fill="currentColor" />
        <circle cx="80" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="120" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
        <path d="M70 12 Q75 6 80 12 Q75 18 70 12" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M120 12 Q125 6 130 12 Q125 18 120 12" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
