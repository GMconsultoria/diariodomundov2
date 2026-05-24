import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Saiba mais sobre o Diário do Mundo, nossa equipe e nossa missão jornalística independente.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">SOBRE O DIÁRIO DO MUNDO</h1>
            <div className="w-12 h-1 bg-accent rounded" />
          </div>
          <div className="space-y-6 text-foreground text-base leading-relaxed">
            <p>
              O Diário do Mundo é um portal de notícias independente com cobertura de política, economia, investimentos, ciência e tecnologia. Nosso compromisso é com a informação verificada, a análise aprofundada e a independência editorial.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">MISSÃO</h2>
            <p>
              Oferecer jornalismo de qualidade, acessível e independente, contribuindo para uma sociedade mais informada e crítica.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">EQUIPE</h2>
            <p>João Silva — Editor-chefe</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">CONTATO DA REDAÇÃO</h2>
            <p>E-mail: contato@diariodomundo.com</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">INFORMAÇÕES LEGAIS</h2>
            <p>
              CNPJ: 12.345.678/0001-90<br />
              São Paulo / SP
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
