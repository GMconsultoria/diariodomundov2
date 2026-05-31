import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça o Diário do Mundo, nossa história, missão e compromisso com o jornalismo independente.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">

          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Sobre o Diário do Mundo
            </h1>
            <div className="w-16 h-1 bg-accent rounded" />
          </div>

          {/* Nossa História */}
          <section className="mb-10 space-y-4 text-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">Nossa História</h2>
            <p>
              O <strong>Diário do Mundo</strong> é um portal de notícias independente com sede em São Paulo.
              Nasceu da convicção de que o Brasil precisa de mais fontes de informação que priorizem a
              qualidade editorial, a verificação de fatos e a independência em relação a grupos políticos e
              econômicos.
            </p>
            <p>
              Desde o início, nossa missão é cobrir os temas que mais impactam a vida dos
              brasileiros — política, economia, investimentos, ciência e tecnologia — com rigor
              jornalístico, linguagem acessível e profundidade analítica.
            </p>
          </section>

          {/* Missão e Valores */}
          <section className="mb-10 bg-muted rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Missão e Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-accent mb-2">Nossa Missão</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Produzir jornalismo de qualidade, independente e acessível, contribuindo para
                  uma sociedade mais informada e crítica.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-accent mb-2">Independência Editorial</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Não somos financiados por partidos políticos, governos ou grupos empresariais.
                  Nossa receita provém de publicidade programática e parcerias editoriais
                  transparentes.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-accent mb-2">Verificação de Fatos</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Toda informação publicada passa por processo de apuração com ao menos uma fonte
                  primária ou documento comprobatório. Erros são corrigidos com transparência e
                  rapidez.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-accent mb-2">Transparência</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Identificamos os autores de todos os conteúdos, declaramos conflitos de
                  interesse e publicamos nossas correções de forma visível.
                </p>
              </div>
            </div>
          </section>

          {/* Processo Editorial */}
          <section className="mb-10 space-y-4 text-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">Processo Editorial</h2>
            <p>
              Cada reportagem publicada no Diário do Mundo segue um processo editorial de três
              etapas: apuração com fontes primárias, revisão de texto e checagem de fatos por um
              segundo jornalista, e aprovação do editor responsável pela categoria.
            </p>
            <p>
              Em caso de erros factuais, publicamos correções de forma destacada no próprio
              artigo, com indicação clara do que foi alterado e quando. Para sugestões de pauta,
              erros ou direito de resposta, utilize nosso{" "}
              <a href="/contato" className="text-accent hover:underline">formulário de contato</a>.
            </p>
            <p>
              Consulte nossa{" "}
              <a href="/politica-editorial" className="text-accent hover:underline">
                Política Editorial completa
              </a>{" "}
              para mais detalhes sobre nossas práticas jornalísticas.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

