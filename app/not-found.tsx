import Link from "next/link";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada | Diário do Mundo",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="text-accent" size={80} />
          </div>
          <h1 className="text-4xl font-black text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">Página não encontrada</h2>
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe, foi removida, teve seu nome alterado ou está temporariamente indisponível.
          </p>
          <Link href="/" className="no-underline inline-block bg-accent text-accent-foreground font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-accent/20">
            Voltar para a Página Inicial
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
