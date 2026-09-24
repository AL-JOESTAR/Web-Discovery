export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleTemplate = "classic" | "hero" | "magazine";

export type GalleryImage = {
  url: string;
  alt?: string;
};

export type Article = {
  id: string;
  category_id: string | null;
  category?: Category | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: unknown | null;
  content_html: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  focus_keyphrase: string | null;
  template: ArticleTemplate;
  gallery: GalleryImage[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content_html: string | null;
  content_json: unknown | null;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type AffiliateLink = {
  id: string;
  nama: string;
  url: string;
  kategori: string | null;
  gambar: string | null;
  harga: number | null;
  created_at: string;
  updated_at: string;
};

export type ThemeSettings = {
  accent: string;
  background: string;
  foreground: string;
  surface: string;
  muted: string;
  line: string;
  sectionDark: string;
};

export type SiteSettings = {
  site: {
    name: string;
    tagline: string;
    description: string;
    domain: string;
    logo_url: string | null;
    og_image: string | null;
    keywords: string;
    socials: {
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      twitter?: string;
      whatsapp?: string;
      youtube?: string;
      email?: string;
    };
    landing?: LandingContent;
    theme?: ThemeSettings;
  };
};

export type LandingContent = {
  hero: {
    title: string;
    subtitle: string;
    image: string | null;
    cta_text: string;
    cta_link: string;
  };
  about: {
    title: string;
    content: string;
    image: string | null;
  };
  features: {
    title: string;
    subtitle: string;
    items: { title: string; description: string; icon?: string }[];
  };
  newsletter: {
    title: string;
    subtitle: string;
  };
};