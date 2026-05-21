import { useRoute } from "wouter";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { getCategoryLink } from "@/lib/categoryUtils";
import { BASE_URL } from "@/const";
import { Loader2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { useEffect, useRef, useMemo } from "react";
import DOMPurify from "dompurify";

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "").trim();
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDatePtBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Article() {
  const [match, params] = useRoute("/noticias/:slug");
  const slug = params?.slug as string;

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Increment view counter once per slug (not on every React Query refetch)
  const incrementView = trpc.posts.incrementView.useMutation();
  const viewCounted = useRef<string | null>(null);

  useEffect(() => {
    if (slug && viewCounted.current !== slug) {
      viewCounted.current = slug;
      incrementView.mutate({ slug });
    }
  }, [slug]);

  // Get related posts from same category (fetch 5, filter current, show 3)
  const { data: relatedPostsRaw } = trpc.posts.getByCategory.useQuery(
    { category: post?.category as any, limit: 5 },
    { enabled: !!post?.category }
  );
  const related = relatedPostsRaw?.filter(p => p.id !== post?.id).slice(0, 3) ?? [];

  const readingTime = useMemo(() => {
    if (!post?.content) return 1;
    return estimateReadingTime(post.content);
  }, [post?.content]);

  const shareUrl = post ? `${BASE_URL}/noticias/${post.slug}` : '';
  const shareText = post?.title || '';

  const publishedDate = post ? new Date(post.publishedAt || post.createdAt) : new Date();
  const modifiedDate = post ? new Date(post.updatedAt || post.createdAt) : new Date();

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={40} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Notícia não encontrada</h1>
            <p className="text-muted-foreground mb-6">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <Link href="/" className="no-underline">
              <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Voltar para Home
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={post.title}
        description={post.subtitle || post.title}
        ogImage={post.imageUrl}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": post.title,
          "description": post.subtitle || post.title,
          "image": [post.imageUrl || `${BASE_URL}/og-image.png`],
          "datePublished": publishedDate.toISOString(),
          "dateModified": modifiedDate.toISOString(),
          "author": [{
            "@type": "Person",
            "name": post.author,
            "url": `${BASE_URL}/`
          }],
          "publisher": {
            "@type": "Organization",
            "name": "Diário do Mundo",
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/favicon.svg`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/noticias/${post.slug}`
          }
        }) }} />
      <Header />

      <main className="flex-1 bg-background">
        {/* Article with Side Ads */}
        <div className="flex justify-center">
          {/* Left Ad Space */}
          <div className="hidden xl:flex w-64 bg-muted items-center justify-center sticky top-20 h-96">
          </div>

          {/* Main Article Content */}
          <article className="w-full max-w-4xl px-4 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="no-underline hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href={getCategoryLink(post.category)} className="no-underline hover:text-foreground">
                {post.category}
              </Link>
              <span>/</span>
              <span className="text-foreground truncate">{post.title}</span>
            </div>

            {/* Category Badge */}
            <div className="mb-6">
              <Link href={getCategoryLink(post.category)} className="no-underline">
                <button className="inline-block bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors cursor-pointer">
                  {post.category}
                </button>
              </Link>
            </div>

            {/* Title - Large for SEO */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {/* Article Byline — Author, Date, Category, Reading Time */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-muted-foreground border-b border-border pb-8 mb-8">
              <div>
                <p className="font-semibold text-foreground">Por {post.author}</p>
              </div>
              <div className="hidden md:block">•</div>
              <div>
                <time dateTime={publishedDate.toISOString()}>
                  {formatDatePtBR(publishedDate)}
                </time>
              </div>
              <div className="hidden md:block">•</div>
              <div>
                <span>{post.category}</span>
              </div>
              <div className="hidden md:block">•</div>
              <div>
                <span>{readingTime} min de leitura</span>
              </div>
              <div className="hidden md:block">•</div>
              <div>
                <span>{post.views} visualizações</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-8">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="eager"
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070";
                  }}
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
              <span className="text-sm font-semibold">Compartilhar:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Compartilhar no Facebook"
              >
                <Facebook size={20} className="text-blue-600" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Compartilhar no Twitter"
              >
                <Twitter size={20} className="text-blue-400" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle size={20} className="text-green-600" />
              </a>
            </div>

            {/* Article Content */}
            <div className="article-content mb-12">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, {
                ALLOWED_TAGS: ['p','br','strong','em','u','s','h2','h3','h4','ul','ol','li',
                               'blockquote','a','img','table','thead','tbody','tr','th','td',
                               'iframe','figure','figcaption','div','span'],
                ALLOWED_ATTR: ['href','src','alt','target','rel','class','width','height',
                               'allowfullscreen','frameborder','sandbox','loading'],
                FORBID_ATTR: ['style', 'onerror', 'onload'],
                ALLOW_UNKNOWN_PROTOCOLS: false,
              }) }} /></div>

            {/* Ad Space in Middle of Content */}
            <div className="my-12 flex justify-center">
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border border-border">
              </div>
            </div>

            {/* Related Articles Section */}
            {related.length > 0 && (
              <section className="mt-16 pt-12 border-t border-border">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Notícias Relacionadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <NewsCard key={r.id} post={r} showCategory={true} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right Ad Space */}
          <div className="hidden xl:flex w-64 bg-muted items-center justify-center sticky top-20 h-96">
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
