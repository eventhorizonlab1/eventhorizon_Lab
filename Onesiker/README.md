<div align="center">
  <img src="public/TAG_ONESIKER.png" width="200" alt="Onesiker Logo" />

  <h1>ONESIKER</h1>

  <p><strong>Premium Digital Portfolio & Shop — Contemporary Artist</strong></p>

  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

---

## 🎨 Overview

**Onesiker** is the official digital presence of Bernard Baudron, a contemporary artist and emblematic figure of the Toulouse graffiti scene. This project combines a high-end visual portfolio with an integrated shop, designed for a seamless, mobile-first experience.

The platform showcases the artist's evolution from street-level graffiti to contemporary gallery work, featuring themes such as **Blueism**, **Miami Vibes**, and **Calligraphie Abstraite**.

## ✨ Key Features

- **Premium Mobile-First Design**: Optimized for high-end mobile devices with smooth animations and interactive transitions.
- **Bilingual Interface**: Full support for French and English, including dynamic metadata and SEO-friendly language handling.
- **Administrative Back-office**: A custom PHP-based management interface for real-time content updates.
- **Automated Image Optimization**: High-performance image processing using `Sharp` to deliver next-gen WebP assets.
- **SEO & Performance**: Advanced SEO implementation with JSON-LD structured data, dynamic Open Graph tags, and conditional GTM loading for GDPR compliance.
- **Interactive Shop**: A showcase of original works and limited editions with integrated contact and inquiry flows.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Hooks, Suspense, Lazy Loading)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 & Vanilla CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend & Admin
- **API**: Custom PHP 8.x REST API
- **Admin UI**: Lightweight Vanilla JS & CSS Administrative Interface
- **Optimization**: Node.js + Sharp for server-side image processing

## 📁 Project Structure

```text
├── public/
│   ├── admin/          # PHP API and Administrative Interface
│   ├── data/           # JSON content and Optimized Assets
│   └── Hero/           # High-resolution optimized media
├── scripts/            # Image processing and maintenance scripts
├── src/
│   ├── components/     # Modular React components
│   ├── context/        # State management (Language, etc.)
│   ├── data/           # Static frontend data
│   └── translations.ts # Multi-language mapping
└── vite.config.ts      # Build configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PHP 8.x (for back-office functionality)

### Installation
1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (if applicable):

   ```bash
   cp .env.example .env.local
   ```

### Development
Run the development server:

```bash
npm run dev
```

### Production Build
Generate a production-ready bundle:

```bash
npm run build
```

## 🖼 Image Optimization

The project includes custom scripts to maintain high visual quality while minimizing load times:
- Use `npm run optimize-images` (or execute via `scripts/`) to convert raw assets to optimized WebP format.
- Automated nomenclature: `[Index]_Onesiker_[Section].webp`.

## 🔒 Security & Compliance
- **GDPR**: Integrated cookie consent with conditional Google Tag Manager loading.
- **Security**: Strict CSRF protection for mutation endpoints and secure session management for the back-office.

---

<div align="center">
  <p>Designed and Built for Onesiker — Toulouse, FR</p>
  <p>© 2026 Bernard Baudron. All rights reserved.</p>
</div>
