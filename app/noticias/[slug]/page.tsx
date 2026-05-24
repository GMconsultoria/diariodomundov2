import { getPostBySlug, getAllPublishedPosts } from "@server/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategoryLink } from "@/lib/categoryUtils";

const BASE_URL = "https://www.diariodomundo.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const publishedDate = post.publishedAt || post.createdAt;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.subtitle || "",
    image: post.imageUrl || `${BASE_URL}/og-image.png`,
    datePublished: publishedDate.toISOString(),
    dateModified: (post.updatedAt || publishedDate).toISOString(),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Diário do Mundo",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/noticias/${post.slug}` },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Category & date */}
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
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Por {post.author}</span>
          </div>

          {/* Hero Image */}
          {post.imageUrl && (
            <figure className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full object-cover max-h-[500px]"
              />
            </figure>
          )}

          {/* Content */}
          <div
            className="article-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
