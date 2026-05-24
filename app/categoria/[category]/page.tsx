import { getPostsByCategory } from "@server/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { CATEGORIES } from "@shared/const";

const BASE_URL = "https://www.diariodomundo.com";

// Map URL slugs back to category names
function slugToCategory(slug: string): string | undefined {
  return CATEGORIES.find(
    (cat) =>
      cat
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-") === slug
  );
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Categoria não encontrada" };

  const canonicalUrl = `${BASE_URL}/categoria/${slug}`;
  return {
    title: `${category} — Últimas Notícias`,
    description: `Acompanhe as últimas notícias de ${category} no Diário do Mundo.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${category} — Diário do Mundo`,
      description: `Acompanhe as últimas notícias de ${category} no Diário do Mundo.`,
      url: canonicalUrl,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  let posts: Awaited<ReturnType<typeof getPostsByCategory>> = [];
  try {
    posts = await getPostsByCategory(category, 50, 0);
  } catch (err) {
    console.error("[CategoryPage] Failed to load posts:", err);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-accent">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category}</h1>
              <p className="text-muted-foreground mt-1">
                {posts.length} {posts.length === 1 ? "artigo" : "artigos"} encontrado{posts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Nenhuma notícia nesta categoria ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard key={post.id} post={post} showCategory={false} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
