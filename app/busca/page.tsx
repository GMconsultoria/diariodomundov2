"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { trpc } from "@/lib/trpc";
import { Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = trpc.posts.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.trim().length >= 2 }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Input */}
      <div className="flex items-center gap-3 mb-8">
        <Search size={24} className="text-accent flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar notícias..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-2xl font-bold border-b-2 border-accent pb-2 focus:outline-none bg-transparent"
          autoFocus
        />
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      )}

      {!isLoading && debouncedQuery.length >= 2 && results?.length === 0 && (
        <p className="text-center py-16 text-muted-foreground text-xl">
          Nenhuma notícia encontrada para "{debouncedQuery}".
        </p>
      )}

      {results && results.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length} resultado{results.length !== 1 ? "s" : ""} para "{debouncedQuery}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <NewsCard key={post.id} post={post} showCategory />
            ))}
          </div>
        </>
      )}

      {debouncedQuery.length < 2 && !isLoading && (
        <p className="text-center py-16 text-muted-foreground">
          Digite pelo menos 2 caracteres para buscar.
        </p>
      )}
    </div>
  );
}

export default function BuscaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={40} /></div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
