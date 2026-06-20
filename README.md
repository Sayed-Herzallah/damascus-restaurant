# Layali Shami — Reverse-engineered source

A faithful rebuild of https://shami-tales-app.lovable.app/ using the same stack Lovable uses:

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** patterns + **lucide-react** icons
- **react-router-dom v6** (`/`, `/menu`, `/contact`)
- **sonner** for toasts, **@tanstack/react-query** ready
- **EN / AR** with full RTL support (toggle in header)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── components/
│   ├── layout/         Header, Footer
│   ├── home/           Hero, About, MenuCategoriesGrid, CategoryCard, OpeningHoursCard
│   ├── shared/         OrnamentDivider
│   └── ui/             Button (shadcn variant)
├── pages/              Index, Menu, Contact, NotFound
├── context/            LanguageContext (EN/AR + RTL)
├── data/               menu.ts (static)
├── lib/                utils.ts (cn helper)
└── index.css           Tailwind + design tokens + custom utilities
```

## Design tokens

All colors live as HSL CSS variables in `src/index.css` (`--primary`, `--accent`, etc.) and are exposed to Tailwind via `tailwind.config.ts`. Custom utilities:

- `.text-gradient-warm`, `.bg-gradient-warm`
- `.pattern-bg` (subtle dotted Levantine pattern)
- `.card-elegant`, `.shadow-elegant`, `.shadow-soft`, `.shadow-glow`
- `.ornament-divider` (uses the reusable `<OrnamentDivider />` SVG)

## Notes

- No backend — menu is static in `src/data/menu.ts`.
- Contact form simulates a submit and shows a sonner toast.
- Language toggle persists in `localStorage` and flips `<html dir>` automatically.
