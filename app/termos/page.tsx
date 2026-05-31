import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Leia os Termos de Uso do Diário do Mundo, incluindo direitos autorais, publicidade, limitações de responsabilidade e regras de utilização do portal.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Termos de Uso</h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: maio de 2026
            </p>
            <div className="w-16 h-1 bg-accent rounded mt-4" />
          </div>

          <div className="space-y-10 text-foreground leading-relaxed text-sm">

            <section>
              <h2 className="text-2xl font-bold mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site <strong>www.diariodomundo.com</strong> (doravante
                "Portal"), você concorda com estes Termos de Uso. Se não concordar com qualquer
                parte destes termos, por favor, não utilize o Portal.
              </p>
              <p className="mt-3">
                Estes Termos aplicam-se a todos os visitantes, leitores e demais usuários do
                Portal. O uso continuado do Portal após alterações nos Termos constitui aceitação
                das novas condições.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Descrição do Serviço</h2>
              <p>
                O Diário do Mundo é um portal de notícias que oferece conteúdo jornalístico
                gratuito nas áreas de política, economia, investimentos, ciência e tecnologia. O
                acesso ao conteúdo é gratuito e não requer cadastro, salvo funcionalidades
                específicas que possam ser introduzidas no futuro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Direitos Autorais e Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo publicado no Portal — incluindo textos, fotografias, ilustrações,
                logotipos, vídeos e design — é protegido pela{" "}
                <strong>Lei nº 9.610/1998 (Lei de Direitos Autorais)</strong> e demais normas de
                propriedade intelectual aplicáveis no Brasil.
              </p>
              <p className="mt-3">É <strong>permitido</strong>:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Compartilhar links diretos para os artigos nas redes sociais e outros meios.</li>
                <li>Reproduzir trechos de até dois parágrafos, com atribuição clara ao Diário do Mundo e link para o artigo original.</li>
                <li>Usar o conteúdo para fins estritamente pessoais e não comerciais.</li>
              </ul>
              <p className="mt-3">É <strong>proibido</strong>:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Reproduzir integral ou substancialmente qualquer artigo sem autorização expressa por escrito.</li>
                <li>Usar o conteúdo para fins comerciais sem licença prévia.</li>
                <li>Remover créditos ou atribuições de autoria do conteúdo reproduzido.</li>
                <li>Criar obras derivadas do conteúdo do Portal sem autorização.</li>
              </ul>

            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Publicidade e Google AdSense</h2>
              <p>
                O Portal é monetizado por meio do programa{" "}
                <strong>Google AdSense</strong>, que exibe anúncios personalizados com base nos
                seus interesses e comportamento de navegação. A exibição desses anúncios está
                sujeita às{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Políticas de Privacidade do Google
                </a>
                .
              </p>
              <p className="mt-3">
                O Google AdSense utiliza cookies (incluindo o cookie DART) para exibir anúncios
                relevantes. Você pode optar por não usar o cookie DART visitando a{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  página de preferências de anúncios do Google
                </a>
                .
              </p>
              <p className="mt-3">
                Em conformidade com a{" "}
                <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>,
                cookies de publicidade personalizada só são ativados com seu consentimento
                explícito, fornecido por meio do banner de cookies exibido na primeira visita ao
                Portal.
              </p>
              <p className="mt-3">
                O Portal não é responsável pelo conteúdo dos anúncios exibidos pelo Google AdSense,
                os quais são selecionados automaticamente pelo sistema do Google. Anunciantes não
                têm qualquer influência sobre o conteúdo editorial do Portal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Isenção de Responsabilidade pelo Conteúdo</h2>
              <p>
                O conteúdo publicado no Portal tem caráter jornalístico e informativo. Embora nos
                esforcemos para garantir a precisão e atualidade das informações, o Portal não
                garante que o conteúdo seja completo, preciso ou adequado para qualquer finalidade
                específica.
              </p>
              <p className="mt-3">
                O conteúdo sobre economia, investimentos e finanças publicado no Portal tem
                caráter exclusivamente informativo e jornalístico, não constituindo recomendação
                de investimento, assessoria financeira ou consultoria. Decisões de investimento
                devem ser tomadas com base em orientação de profissionais habilitados.
              </p>
              <p className="mt-3">
                Da mesma forma, conteúdo sobre saúde e medicina é de caráter informativo e não
                substitui consulta médica profissional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Links para Sites de Terceiros</h2>
              <p>
                O Portal pode conter links para sites de terceiros. Esses links são fornecidos
                apenas para conveniência informativa e não representam endosso do Portal ao
                conteúdo ou às práticas desses sites. O Portal não tem controle sobre o conteúdo
                de sites de terceiros e não assume responsabilidade por eventuais danos decorrentes
                do acesso a esses sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Conduta do Usuário</h2>
              <p>
                Ao utilizar o Portal, você concorda em não:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Utilizar o Portal para fins ilegais ou não autorizados.</li>
                <li>Tentar acessar áreas restritas do Portal sem autorização.</li>
                <li>Transmitir vírus, malware ou qualquer código malicioso.</li>
                <li>Reproduzir, distribuir ou modificar conteúdo do Portal sem autorização.</li>
                <li>Utilizar sistemas automatizados (bots, scrapers) para acessar o Portal sem autorização expressa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Privacidade e Proteção de Dados</h2>
              <p>
                O uso dos seus dados pessoais é regido por nossa{" "}
                <a href="/politica-de-privacidade" className="text-accent hover:underline">
                  Política de Privacidade
                </a>
                , que faz parte integrante destes Termos. Recomendamos a leitura atenta desse
                documento para compreender como coletamos, utilizamos e protegemos seus dados
                pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Direito de Resposta e DMCA</h2>
              <p>
                Pessoas físicas ou jurídicas que se sintam prejudicadas por conteúdo publicado no
                Portal podem solicitar direito de resposta por meio de nosso{" "}
                <a href="/contato" className="text-accent hover:underline">
                  formulário de contato
                </a>
                .
              </p>
              <p className="mt-3">
                Para notificações de violação de direitos autorais (DMCA ou legislação brasileira
                equivalente), envie a solicitação com identificação do conteúdo protegido, prova
                de titularidade e indicação do conteúdo supostamente infrator para{" "}
                <a href="/contato" className="text-accent hover:underline">
                  formulário de contato
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Limitação de Responsabilidade</h2>
              <p>
                Na máxima extensão permitida pela legislação brasileira, o Portal e seus
                operadores não serão responsáveis por danos diretos, indiretos, incidentais,
                consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso do
                Portal ou de seu conteúdo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Alterações nestes Termos</h2>
              <p>
                Reservamo-nos o direito de alterar estes Termos a qualquer momento. Alterações
                significativas serão comunicadas de forma visível no Portal. A data de "última
                atualização" no topo desta página indica quando os Termos foram revisados pela
                última vez. O uso continuado do Portal após a publicação de alterações constitui
                aceitação dos novos Termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">12. Legislação Aplicável e Foro</h2>
              <p>
                Estes Termos são regidos pela legislação da República Federativa do Brasil.
                Eventuais disputas serão submetidas ao foro da comarca de São Paulo, Estado de São
                Paulo, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">13. Contato</h2>
              <p>
                Dúvidas sobre estes Termos de Uso podem ser enviadas para o nosso{" "}
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
