import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Política de Privacidade" 
        description="Nossa política de privacidade e informações sobre como tratamos seus dados pessoais e navegação."
      />
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">POLÍTICA DE PRIVACIDADE — DIÁRIO DO MUNDO</h1>
            <p className="text-sm text-muted-foreground mt-2">Última atualização: 20 de maio de 2026</p>
            <div className="w-12 h-1 bg-accent rounded mt-4"></div>
          </div>

          <div className="space-y-6 text-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">1. SOBRE ESTE SITE</h2>
              <p>
                O Diário do Mundo é um portal de notícias independente dedicado à cobertura de política, economia, investimentos e tecnologia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">2. COLETA DE DADOS</h2>
              <p>
                Coletamos dados de navegação como endereço IP, tipo de navegador, páginas visitadas e duração da sessão por meio de cookies e tecnologias similares. Esses dados são usados exclusivamente para análise de audiência e melhoria da experiência do usuário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">3. COOKIES E PUBLICIDADE — GOOGLE ADSENSE</h2>
              <p>
                Este site utiliza o Google AdSense para exibição de anúncios. O Google, como fornecedor terceirizado, utiliza cookies (incluindo o cookie DART) para exibir anúncios personalizados com base nas visitas anteriores do usuário a este e a outros sites na internet.
              </p>
              <p className="mt-4">
                Você pode desativar o uso do cookie DART acessando: <br />
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  https://policies.google.com/technologies/ads
                </a>
              </p>
              <p className="mt-4">
                Para mais informações sobre como o Google usa dados de parceiros, acesse: <br />
                <a href="https://policies.google.com/privacy/partners" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  https://policies.google.com/privacy/partners
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">4. GOOGLE ANALYTICS</h2>
              <p>
                Utilizamos o Google Analytics (GA4) para medir o desempenho do site. Os dados coletados são anonimizados. Saiba mais em: <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  https://policies.google.com/privacy
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">5. SEUS DIREITOS — LGPD (Lei nº 13.709/2018)</h2>
              <p>
                Você tem direito a: acessar seus dados pessoais, corrigir dados incorretos, solicitar exclusão, revogar consentimento e solicitar portabilidade dos dados. Para exercer esses direitos, entre em contato pelo e-mail: contato@diariodomundo.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">6. RETENÇÃO DE DADOS</h2>
              <p>
                Os dados de navegação são retidos por até 26 meses, conforme configuração padrão do Google Analytics, após o que são automaticamente excluídos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">7. ALTERAÇÕES NESTA POLÍTICA</h2>
              <p>
                Podemos atualizar esta política periodicamente. A data de "última atualização" no topo desta página sempre refletirá a versão mais recente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mt-8 mb-4">8. CONTATO</h2>
              <p>
                Para dúvidas sobre privacidade: contato@diariodomundo.com
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
