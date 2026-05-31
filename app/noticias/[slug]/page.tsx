import { getPostBySlug } from "@server/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseUnit from "@/components/AdSenseUnit";
import { getCategoryLink } from "@/lib/categoryUtils";
import { sanitizeArticleHtml } from "@shared/sanitize";

const BASE_URL = "https://www.diariodomundo.com";

// ─── SLOTS ADSENSE ─────────────────────────────────────────────────────────────
// Substitua pelos IDs reais gerados no painel do Google AdSense
const AD_SLOT_ARTICLE_TOP     = "AAAAAAAAAA"; // Abaixo do título, acima da imagem
const AD_SLOT_ARTICLE_MID     = "BBBBBBBBBB"; // In-content (após 1º bloco de texto)
const AD_SLOT_ARTICLE_BOTTOM  = "CCCCCCCCCC"; // Após o fim do artigo
// ──────────────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try { post = await getPostBySlug(slug); } catch {}

  if (!post) {
    return { title: "Artigo não encontrado" };
  }

  const description = post.subtitle || post.content?.replace(/<[^>]+>/g, "").slice(0, 160) || "";
  const canonicalUrl = `${BASE_URL}/noticias/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: canonicalUrl,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author],
      siteName: "Diário do Mundo",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let post = null;
  try { post = await getPostBySlug(slug); } catch {}

  if (!post || !post.published) {
    notFound();
  }

  const publishedDate = post.publishedAt || post.createdAt;
  const updatedDate = post.updatedAt || null;
  const wasUpdated =
    updatedDate &&
    Math.abs(updatedDate.getTime() - publishedDate.getTime()) > 60 * 60 * 1000; // diferença > 1h

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.subtitle || "",
    image: post.imageUrl || `${BASE_URL}/og-image.png`,
    datePublished: publishedDate.toISOString(),
    dateModified: (updatedDate || publishedDate).toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
      url: `${BASE_URL}/sobre`,
    },
    publisher: {
      "@type": "Organization",
      name: "Diário do Mundo",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/noticias/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-8">

          {/* Categoria & data */}
          <div className="flex items-center gap-3 mb-4">
            <Link href={getCategoryLink(post.category)} className="no-underline">
              <span className="inline-block bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors">
                {post.category}
              </span>
            </Link>
            <time
              dateTime={publishedDate.toISOString()}
              className="text-sm text-muted-foreground"
            >
              {publishedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
            {wasUpdated && (
              <span className="text-xs text-muted-foreground italic">
                · Atualizado em{" "}
                <time dateTime={updatedDate!.toISOString()}>
                  {updatedDate!.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtítulo */}
          {post.subtitle && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Autor */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-accent">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Por {post.author}</p>
              <p className="text-xs text-muted-foreground">Redação Diário do Mundo</p>
            </div>
          </div>

          {/* ── Anúncio AdSense — Abaixo do Título ── */}
          <div className="mb-6">
            <AdSenseUnit
              slot={AD_SLOT_ARTICLE_TOP}
              format="auto"
              style={{ display: "block", width: "100%", minHeight: "90px" }}
            />
          </div>

          {/* Imagem de destaque */}
          {post.imageUrl && (
            <figure className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full object-cover max-h-[500px]"
              />
            </figure>
          )}

          {/* Conteúdo do artigo com anúncio in-content */}
          <ArticleContentWithAd
            content={sanitizeArticleHtml(post.content)}
            midSlot={AD_SLOT_ARTICLE_MID}
          />

          {/* ── Anúncio AdSense — Após o Artigo ── */}
          <div className="mt-10 pt-6 border-t border-border">
            <AdSenseUnit
              slot={AD_SLOT_ARTICLE_BOTTOM}
              format="auto"
              style={{ display: "block", width: "100%", minHeight: "250px" }}
            />
          </div>

          {/* Box de autor */}
          <div className="mt-10 p-6 bg-muted rounded-xl border border-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">
              Sobre o autor
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-accent">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jornalista da redação do Diário do Mundo, com cobertura em{" "}
                  {post.category}.
                </p>
                <Link
                  href="/sobre"
                  className="text-xs text-accent hover:underline mt-2 inline-block"
                >
                  Conheça nossa equipe →
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </main>

      <Footer />
    </div>
  );
}

/**
 * Injeta um anúncio in-content após o primeiro bloco significativo de texto.
 * Divide o HTML no ponto médio para inserir o ad de forma natural.
 */
function ArticleContentWithAd({
  content,
  midSlot,
}: {
  content: string;
  midSlot: string;
}) {
  // Divide o conteúdo após a ~3ª tag de fechamento de parágrafo
  const splitMarker = "</p>";
  const parts = content.split(splitMarker);
  const splitAt = Math.min(3, Math.floor(parts.length / 2));

  if (parts.length <= splitAt + 1) {
    // Conteúdo curto: exibir sem divisão
    return (
      <div
        className="article-content prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const firstHalf = parts.slice(0, splitAt).join(splitMarker) + splitMarker;
  const secondHalf = parts.slice(splitAt).join(splitMarker);

  return (
    <>
      <div
        className="article-content prose max-w-none"
        dangerouslySetInnerHTML={{ __html: firstHalf }}
      />
      <div className="my-6">
        <AdSenseUnit
          slot={midSlot}
          format="fluid"
          layout="in-article"
          style={{ display: "block", textAlign: "center" }}
        />
      </div>
      <div
        className="article-content prose max-w-none"
        dangerouslySetInnerHTML={{ __html: secondHalf }}
      />
    </>
  );
}
