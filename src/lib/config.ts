import type { LandingContent, ThemeSettings } from "@/lib/types";

export const DEFAULT_THEME: ThemeSettings = {
  accent: "#b8452c",
  background: "#faf9f7",
  foreground: "#1c1917",
  surface: "#ffffff",
  muted: "#78716c",
  line: "#e7e5e4",
  sectionDark: "#0c0a09",
};

export const TAGS = {
  articles: "articles",
  categories: "categories",
  pages: "pages",
  settings: "site-settings",
} as const;

export const DEFAULT_LANDING: LandingContent = {
  hero: {
    title: "Temukan Gaya Fesyen Terbaikmu",
    subtitle:
      "Inspirasi, tips, dan panduan fashion terkini untuk gaya hidup harianmu.",
    image: null,
    cta_text: "Jelajahi Artikel",
    cta_link: "/blog",
  },
  about: {
    title: "Tentang Kami",
    content:
      "Kami menghadirkan konten seputar fashion, tren terkini, dan gaya hidup yang menginspirasi.",
    image: null,
  },
  features: {
    title: "Kenapa Memilih Kami",
    subtitle: "Konten berkualitas yang menginspirasi gaya hidupmu",
    items: [
      {
        title: "Tren Terbaru",
        description: "Selalu update dengan tren fashion terbaru setiap musim.",
      },
      {
        title: "Tips Terpercaya",
        description: "Panduan memilih dan memadukan busana untuk berbagai acara.",
      },
      {
        title: "Konten Berkualitas",
        description: "Artikel yang ditulis dengan riset mendalam dan mudah dibaca.",
      },
    ],
  },
  newsletter: {
    title: "Berlangganan Newsletter",
    subtitle: "Dapatkan tips fashion terbaru langsung di email kamu.",
  },
};

export const hasPublicEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasAdminEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasPexelsEnv = !!process.env.PEXELS_API_KEY;

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!fromEnv) return "http://localhost:3000";
  if (fromEnv.startsWith("http")) return fromEnv;
  return `https://${fromEnv}`;
}