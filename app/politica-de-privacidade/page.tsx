import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Diário do Mundo coleta, usa e protege seus dados pessoais, incluindo o uso de cookies, Google AdSense e Google Analytics.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Política de Privacidade
            </h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: maio de 2026
            </p>
            <div className="w-16 h-1 bg-accent rounded mt-4" />
          </div>

          <div className="space-y-10 text-foreground text-sm leading-relaxed">

            <section>
              <h2 className="text-xl font-bold mb-3">1. Quem somos</h2>
              <p>
                O <strong>Diário do Mundo</strong> (www.diariodomundo.com) é um portal de
                notícias independente com sede em São Paulo, SP. Esta Política de Privacidade
                descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais,
                em conformidade com a <strong>Lei Geral de Proteção de Dados — LGPD (Lei nº
                  13.709/2018)</strong>.
              </p>

            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Dados que coletamos</h2>
              <p>Coletamos as seguintes categorias de dados:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>
                  <strong>Dados de navegação:</strong> endereço IP (anonimizado), tipo de
                  navegador, sistema operacional, páginas visitadas, tempo de permanência e
                  origem do acesso.
                </li>
                <li>
                  <strong>Dados de formulário de contato:</strong> nome, e-mail e mensagem,
                  quando você envia uma mensagem pelo nosso formulário.
                </li>
                <li>
                  <strong>Cookies e tecnologias similares:</strong> cookies de sessão,
                  preferências, análise de audiência e publicidade (ver seção 4).
                </li>
              </ul>
              <p className="mt-3">
                Não coletamos dados sensíveis como origem racial, opiniões políticas, dados de
                saúde ou dados financeiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Finalidade e base legal do tratamento</h2>
              <div className="overflow-x-auto mt-3">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left font-bold">Finalidade</th>
                      <th className="border border-border p-2 text-left font-bold">Base Legal (LGPD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Análise de audiência e melhoria do site (GA4)", "Consentimento (Art. 7º, I)"],
                      ["Exibição de anúncios personalizados (AdSense)", "Consentimento (Art. 7º, I)"],
                      ["Resposta a formulários de contato", "Execução de contrato / Legítimo interesse (Art. 7º, V)"],
                      ["Segurança e prevenção de fraudes", "Legítimo interesse (Art. 7º, IX)"],
                      ["Cumprimento de obrigações legais", "Obrigação legal (Art. 7º, II)"],
                    ].map(([fin, base]) => (
                      <tr key={fin}>
                        <td className="border border-border p-2">{fin}</td>
                        <td className="border border-border p-2">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Cookies e publicidade</h2>
              <p>
                Você pode aceitar ou recusar cookies de marketing ao ser exibido o banner de
                cookies na primeira visita. Para revogar seu consentimento a qualquer momento,
                limpe os dados do site no seu navegador (Configurações → Privacidade →
                Limpar dados do site para diariodomundo.com), e o banner será exibido novamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Compartilhamento de dados</h2>
              <p>Seus dados podem ser compartilhados com:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>
                  <strong>Google LLC</strong> (Analytics e AdSense) — com base nas suas políticas
                  de privacidade, sujeitas ao{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Privacy Policy do Google
                  </a>
                  .
                </li>
                <li>
                  <strong>Autoridades públicas</strong> — quando exigido por lei ou ordem
                  judicial.
                </li>
              </ul>
              <p className="mt-3">
                Não vendemos seus dados pessoais a terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Seus direitos — LGPD</h2>
              <p>Conforme a LGPD, você tem os seguintes direitos em relação aos seus dados:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e obter uma cópia.</li>
                <li><strong>Correção:</strong> solicitar a atualização de dados incorretos.</li>
                <li><strong>Anonimização, bloqueio ou eliminação:</strong> solicitar que dados desnecessários sejam eliminados.</li>
                <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
                <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento.</li>
                <li><strong>Oposição:</strong> opor-se ao tratamento realizado com fundamento em outras bases legais.</li>
              </ul>
              <p className="mt-3">
                Para exercer seus direitos, entre em contato pelo nosso formulário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Segurança dos dados</h2>
              <p>
                Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados
                contra acesso não autorizado, perda ou destruição, incluindo transmissão via
                HTTPS e acesso restrito às bases de dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Menores de idade</h2>
              <p>
                Este portal não é direcionado a menores de 16 anos e não coleta intencionalmente
                dados de crianças. Se identificarmos que dados de menores foram coletados sem
                consentimento parental, os eliminaremos imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Alterações nesta política</h2>
              <p>
                Esta política pode ser atualizada periodicamente. A data de "última atualização"
                no topo sempre refletirá a versão mais recente. Alterações significativas serão
                comunicadas de forma visível no Portal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Contato</h2>
              <p>
                Dúvidas sobre privacidade: através do nosso {" "}
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
