# Damascus Restaurant Hub: Bilingual Order System & RTL Sync Layout

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,100:ea580c&height=160&section=header&text=Damascus%20Restaurant&fontSize=42&fontColor=ffffff&fontFamily=Outfit" width="100%" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-2023-blue?logo=react&style=for-the-badge" alt="React" /> <img src="https://img.shields.io/badge/TanStack%20Query-State-red?logo=reactquery&style=for-the-badge" alt="TanStack Query" /> <img src="https://img.shields.io/badge/I18n-Bilingual-blue?logo=googletranslate&style=for-the-badge" alt="I18n" /> <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

واجهة **مطعم بوابات الشام** هي منصة تفاعلية سريعة تتيح للمستخدمين تصفح قائمة الوجبات السورية وحجز الطلبات بلغات متعددة (عربي/إنجليزي) مع دعم متكامل ومباشر لتنسيق RTL العربي ومزامنة حالة سلة المشتريات.

This repository holds the React frontend storefront and ordering client for the **Damascus Restaurant Portal**. It features state-of-the-art multilingual layout transitions and full RTL rendering persistence.

---

## 🧬 Translation & Ordering State Flow

The application coordinates translation keys and syncs menu items caching:

```mermaid
graph TD
    User[Storefront Visitor] -->|Toggle Language switch| i18n[i18next translation manager]
    i18n -->|Toggle HTML dir attribute 'rtl'/'ltr'| Layout[RTL CSS layout grid adjustment]
    User -->|Add dish to cart| Cart[Local React Context State]
    Cart -->|Trigger order checkout| TanStack[TanStack Query HTTP POST]
    TanStack -->|Success| Reset[Empty Cart Context & show invoice status]
```

---

## 🧬 Key Frontend Features

1.  **RTL/LTR Layout Sync**: Dynamic HTML direction wrapper mapping CSS Grid and typography styles.
2.  **TanStack Query Cache**: Fast item query cache prevents server fetching loops when navigating menu sections.
3.  **Interactive Booking Wizard**: Simple interactive checkout wizard managing guest forms and food selections.

---

## 🛠️ Technology Stack & Styling Assets

*   **Framework**: **React 18** + **Vite** for high performance.
*   **State Management**: **TanStack Query** (React Query) + local Context API.
*   **Localization**: **i18next** translation package.
*   **Design**: HSL customized design systems supporting responsive layouts.

---

## 📂 Repository Module Layout

```text
damascus-restaurant/
├── src/
│   ├── components/      # Menu cards, Cart drawers, Order modals
│   ├── locales/         # i18n English & Arabic translation sheets
│   ├── context/         # React Cart Context state handlers
│   ├── App.jsx          # Storefront layout controller
│   └── main.jsx         # Render entry point
├── package.json         # Node metadata
└── README.md            # System documentation
```

---

## ⚡ Local Setup & Run
```bash
git clone https://github.com/Sayed-Herzallah/damascus-restaurant.git
cd damascus-restaurant
npm install
npm run dev
```

---

## 📄 License
Licensed under the **MIT License**.
