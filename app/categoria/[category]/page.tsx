import { getPostsByCategory } from "@server/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import AdSenseUnit from "@/components/AdSenseUnit";
import { CATEGORIES } from "@shared/const";

const BASE_URL = "https://www.diariodomundo.com";
const PAGE_SIZE = 12;

// Slot AdSense para páginas de categoria — substitua pelo ID real
const AD_SLOT_CATEGORY = "DDDDDDDDDD";

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
  searchParams: Promise<{ pagina?: string }>;
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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { pagina } = await searchParams;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const currentPage = Math.max(1, parseInt(pagina || "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Busca uma página extra para saber se há próxima página
  let posts: Awaited<ReturnType<typeof getPostsByCategory>> = [];
  try {
    posts = await getPostsByCategory(category, PAGE_SIZE + 1, offset);
  } catch (err) {
    console.error("[CategoryPage] Failed to load posts:", err);
  }

  const hasNextPage = posts.length > PAGE_SIZE;
  const displayPosts = posts.slice(0, PAGE_SIZE);
  const hasPrevPage = currentPage > 1;

  const baseHref = `/categoria/${slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Cabeçalho da categoria */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-accent">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category}</h1>
              <p className="text-muted-foreground mt-1">
                {displayPosts.length === 0
                  ? "Nenhum artigo encontrado"
                  : `Página ${currentPage}${hasNextPage || hasPrevPage ? ` — ${PAGE_SIZE} artigos por página` : ""}`}
              </p>
            </div>
          </div>

          {/* Anúncio topo da categoria */}
          {currentPage === 1 && (
            <div className="mb-8">
              <AdSenseUnit
                slot={AD_SLOT_CATEGORY}
                format="auto"
                style={{ display: "block", width: "100%", minHeight: "90px" }}
              />
            </div>
          )}

          {/* Grid de artigos */}
          {displayPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Nenhuma notícia nesta categoria ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((post) => (
                <NewsCard key={post.id} post={post} showCategory={false} />
              ))}
            </div>
          )}

          {/* Paginação */}
          {(hasPrevPage || hasNextPage) && (
            <nav
              aria-label="Paginação"
              className="flex items-center justify-center gap-4 mt-12"
            >
              {hasPrevPage ? (
                <Link
                  href={currentPage === 2 ? baseHref : `${baseHref}?pagina=${currentPage - 1}`}
                  className="no-underline flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                  ← Anterior
                </Link>
              ) : (
                <span className="px-5 py-2.5 text-sm text-muted-foreground select-none">← Anterior</span>
              )}

              <span className="text-sm text-muted-foreground font-medium px-3">
                Página {currentPage}
              </span>

              {hasNextPage ? (
                <Link
                  href={`${baseHref}?pagina=${currentPage + 1}`}
                  className="no-underline flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                  Próxima →
                </Link>
              ) : (
                <span className="px-5 py-2.5 text-sm text-muted-foreground select-none">Próxima →</span>
              )}
            </nav>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
