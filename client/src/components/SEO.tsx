import { useEffect } from "react";
import { useLocation } from "wouter";
import { BASE_URL } from "@/const";

interface SEOProps {
  title?: string | null;
  description?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: "website" | "article";
  canonical?: string | null;
}

export default function SEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  canonical,
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    const baseTitle = "Diário do Mundo | Notícias Independentes";
    document.title = title ? `${title} | Diário do Mundo` : baseTitle;

    // Canonical — always use BASE_URL + current path, never window.location
    const canonicalUrl = canonical || `${BASE_URL}${location === "/" ? "/" : location}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute("href", canonicalUrl);
    }

    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia.");
    }

    // Open Graph
    const setOgMeta = (property: string, content: string) => {
      const tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute("content", content);
    };

    setOgMeta("og:type", ogType);
    setOgMeta("og:title", ogTitle || title || baseTitle);
    setOgMeta("og:description", ogDescription || description || "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia.");
    setOgMeta("og:url", canonicalUrl);
    setOgMeta("og:site_name", "Diário do Mundo");

    if (ogImage) {
      // If ogImage is a relative path, prefix with BASE_URL
      const imageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;
      setOgMeta("og:image", imageUrl);
    } else {
      setOgMeta("og:image", `${BASE_URL}/og-image.png`);
    }

    // Twitter
    const setTwitterMeta = (name: string, content: string) => {
      const tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) tag.setAttribute("content", content);
    };

    setTwitterMeta("twitter:title", ogTitle || title || baseTitle);
    setTwitterMeta("twitter:description", ogDescription || description || "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia.");

  }, [title, description, ogTitle, ogDescription, ogImage, ogType, canonical, location]);

  return null;
}
