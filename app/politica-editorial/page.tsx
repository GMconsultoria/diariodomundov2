import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política Editorial",
  description:
    "Conheça os princípios e processos editoriais do Diário do Mundo: apuração, verificação de fatos, correções e independência editorial.",
  alternates: { canonical: "/politica-editorial" },
};

export default function PoliticaEditorialPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Política Editorial</h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: maio de 2026
            </p>
            <div className="w-16 h-1 bg-accent rounded mt-4" />
          </div>

          <div className="space-y-10 text-foreground leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold mb-3">1. Missão e Independência</h2>
              <p>
                O <strong>Diário do Mundo</strong> é um portal de jornalismo independente. Não
                mantemos vínculos editoriais com partidos políticos, governos federais, estaduais
                ou municipais, nem com grupos empresariais que possam comprometer nossa
                independência de cobertura.
              </p>
              <p className="mt-3">
                Nenhum anunciante tem influência sobre a seleção de pautas ou o conteúdo
                editorial.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Critérios de Seleção de Pautas</h2>
              <p>
                As pautas são selecionadas com base nos seguintes critérios, em ordem de
                relevância:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-sm">
                <li>
                  <strong>Relevância pública:</strong> o tema afeta diretamente a vida de um
                  número significativo de brasileiros.
                </li>
                <li>
                  <strong>Novidade e atualidade:</strong> o fato é recente ou há novo
                  desenvolvimento relevante sobre um tema em curso.
                </li>
                <li>
                  <strong>Verificabilidade:</strong> é possível apurar e comprovar as informações
                  com fontes primárias confiáveis.
                </li>
                <li>
                  <strong>Interesse jornalístico:</strong> o tema tem valor informativo genuíno,
                  não apenas apelo emocional ou comercial.
                </li>
              </ul>
              <p className="mt-3">
                Não publicamos conteúdo sensacionalista, teorias sem embasamento factual, nem
                rumores sem confirmação de fontes primárias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Processo de Apuração</h2>
              <p>
                Todo conteúdo publicado passa pelas seguintes etapas antes de ir ao ar:
              </p>
              <ol className="list-decimal list-inside mt-3 space-y-2 text-sm">
                <li>
                  <strong>Apuração primária:</strong> levantamento de informações com pelo menos
                  uma fonte primária (documento oficial, declaração em primeira mão, dado
                  estatístico de órgão competente).
                </li>
                <li>
                  <strong>Busca de contraditório:</strong> quando o conteúdo envolve acusações ou
                  posições divergentes, buscamos sempre o direito de resposta dos envolvidos antes
                  da publicação.
                </li>
                <li>
                  <strong>Revisão editorial:</strong> o texto é revisado por um segundo jornalista
                  para verificação de fatos, coerência e precisão.
                </li>
                <li>
                  <strong>Aprovação do editor:</strong> o editor responsável pela categoria aprova
                  a publicação após verificar que todos os critérios foram atendidos.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Fontes e Atribuição</h2>
              <p>
                Priorizamos o uso de fontes identificadas. Quando é necessário usar fontes
                anônimas, isso será indicado no texto com justificativa para o anonimato (ex.:
                "funcionário que pediu para não ser identificado por temer represálias").
              </p>
              <p className="mt-3">
                Não publicamos informações baseadas exclusivamente em fontes anônimas sem pelo
                menos uma confirmação adicional de outra fonte ou documento.
              </p>
              <p className="mt-3">
                Todo conteúdo é atribuído ao jornalista responsável pela apuração. Não
                publicamos conteúdo sem identificação de autoria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Uso de Inteligência Artificial</h2>
              <p>
                Ferramentas de inteligência artificial podem ser usadas como apoio na pesquisa,
                organização de informações e revisão gramatical. No entanto, todo conteúdo
                publicado é integralmente revisado, editado e aprovado por jornalistas humanos.
              </p>
              <p className="mt-3">
                Não publicamos conteúdo gerado automaticamente por IA sem revisão editorial
                humana substancial. A responsabilidade pela precisão e qualidade do conteúdo
                publicado é sempre do jornalista identificado na assinatura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Correções e Errata</h2>
              <p>
                Erros factuais são corrigidos o mais rápido possível após a identificação. As
                correções são feitas de forma transparente:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-sm">
                <li>
                  Uma nota de correção é adicionada ao início ou ao fim do artigo, descrevendo
                  o que foi alterado, por quê e quando.
                </li>
                <li>
                  A data de atualização do artigo é atualizada para refletir a correção.
                </li>
                <li>
                  Para erros graves, publicamos também uma nota editorial separada.
                </li>
              </ul>
              <p className="mt-3">
                Para reportar um erro, utilize nosso{" "}
                <a href="/contato" className="text-accent hover:underline">
                  formulário de contato
                </a>{" "}
                selecionando o assunto "Erro jornalístico".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Conteúdo Patrocinado e Publicidade</h2>
              <p>
                Todo conteúdo patrocinado ou pago é claramente identificado com o rótulo
                "Conteúdo Patrocinado" ou "Publicidade" de forma visível antes do texto.
                Anúncios como os do Google AdSense são identificados como "Publicidade" e são
                selecionados automaticamente pelo sistema, sem interferência editorial nossa
                na seleção dos anunciantes.
              </p>
              <p className="mt-3">
                Anunciantes não têm acesso, influência ou direito de revisão sobre nosso
                conteúdo editorial.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Conflito de Interesses</h2>
              <p>
                Jornalistas do Diário do Mundo não podem cobrir temas nos quais tenham interesse
                financeiro direto ou relação pessoal próxima com as partes envolvidas sem
                declarar esse conflito. Em caso de conflito identificado, o jornalista é afastado
                da cobertura ou o conflito é explicitamente declarado no texto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Diversidade e Pluralismo</h2>
              <p>
                O Diário do Mundo compromete-se a apresentar pluralidade de vozes e perspectivas
                em sua cobertura, especialmente em temas políticos e de interesse público.
                Cobertura de eleições e processos democráticos seguirá sempre o princípio de dar
                espaço equilibrado a diferentes posições políticas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Contato</h2>
              <p>
                Dúvidas sobre esta política, sugestões de pauta ou pedidos de direito de resposta
                podem ser enviados através do nosso {" "}
                <a href="/contato" className="text-accent hover:underline">
                  formulário de contato
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
