"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Minimal Header */}
          <header className="sticky top-0 z-50 bg-black text-white py-4 border-b-2 border-red-600">
            <div className="container mx-auto px-4">
              <Link href="/" className="no-underline">
                <span className="text-2xl md:text-3xl font-bold whitespace-nowrap">
                  DIÁRIO DO <span className="text-red-600">MUNDO</span>
                </span>
              </Link>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-3">
                Algo deu errado
              </h1>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                Ocorreu um erro inesperado ao carregar esta página. Nossa equipe foi
                notificada. Você pode tentar novamente ou voltar para a página
                inicial.
              </p>

              {error.digest && (
                <p className="text-xs text-muted-foreground mb-6 font-mono bg-muted px-3 py-1 rounded inline-block">
                  Código: {error.digest}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg shadow-accent/20"
                >
                  <RefreshCw size={18} />
                  Tentar novamente
                </button>
                <Link href="/" className="no-underline">
                  <button className="w-full px-6 py-3 bg-muted text-foreground border border-border rounded-lg hover:bg-muted/80 transition-all font-semibold">
                    Voltar para o início
                  </button>
                </Link>
              </div>
            </div>
          </main>

          <footer className="bg-black text-white py-4 text-center text-sm border-t-2 border-red-600">
            <p>
              © {new Date().getFullYear()} Diário do Mundo. Todos os direitos
              reservados.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
