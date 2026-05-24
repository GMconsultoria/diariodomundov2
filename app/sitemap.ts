import type { MetadataRoute } from "next";
import { getAllPublishedPosts } from "@server/db";
import { CATEGORIES } from "@shared/const";
import { categoryToSlug } from "@/lib/categoryUtils";

const BASE_URL = "https://www.diariodomundo.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base static routes
  const routes = ["", "/sobre", "/politica-de-privacidade", "/termos", "/contato"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "always" : "monthly") as any,
    priority: route === "" ? 1 : 0.8,
  }));

  // Category routes
  const categoryRoutes = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/categoria/${categoryToSlug(category)}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as any,
    priority: 0.9,
  }));

  // Article routes (max 10,000 for sitemap performance, usually paginated in huge sites)
  const posts = await getAllPublishedPosts(1000, 0);
  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/noticias/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || post.createdAt,
    changeFrequency: "never" as any,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...postRoutes];
}
