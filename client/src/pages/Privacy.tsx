import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Política de Privacidade" />
      <Header />

      <main className="flex-1 bg-background">
        <div className="container max-w-4xl py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Política de Privacidade</h1>
            <p className="text-sm text-muted-foreground mt-2">Última atualização: 20 de maio de 2026</p>
            <div className="w-12 h-1 bg-accent rounded mt-4"></div>
          </div>

          <div className="space-y-6 text-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introdução e Base Legal</h2>
              <p>
                O Diário do Mundo coleta dados de navegação como endereço IP, tipo de navegador, páginas visitadas e tempo de permanência, por meio de cookies e tecnologias similares, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Dados Coletados</h2>
              <p>
                Coletamos apenas o mínimo necessário para operar o portal:
              </p>
              <ul className="ml-4 space-y-2 mt-2">
                <li>• <strong>Dados de Login:</strong> Nome e e-mail via Google OAuth para identificar sua conta.</li>
                <li>• <strong>Dados de Contato:</strong> Nome, e-mail e conteúdo da mensagem enviados via formulário.</li>
                <li>• <strong>Dados de Acesso:</strong> Endereço IP (mascarado), tipo de dispositivo e páginas visitadas para fins estatísticos e segurança.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Finalidade do Tratamento</h2>
              <p>
                Os dados são usados para:
              </p>
              <ul className="ml-4 space-y-2 mt-2">
                <li>• (a) Análise de audiência;</li>
                <li>• (b) Personalização de publicidade por terceiros (Google AdSense);</li>
                <li>• (c) Melhoria da experiência do usuário;</li>
                <li>• (d) Gerenciar seu acesso ao portal e responder a solicitações via formulário.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Seus Direitos (Art. 18 da LGPD)</h2>
              <p>
                Você tem direito a:
              </p>
              <ul className="ml-4 space-y-2 mt-2">
                <li>• Acessar seus dados.</li>
                <li>• Corrigir dados incorretos ou incompletos.</li>
                <li>• <strong>Solicitar exclusão:</strong> Você pode excluir sua conta e dados a qualquer momento.</li>
                <li>• Solicitar portabilidade.</li>
                <li>• Revogar consentimento para cookies e publicidade.</li>
              </ul>
              <p className="mt-4">Para exercer esses direitos, entre em contato através da nossa <a href="/contato" className="text-accent hover:underline">página de contato</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Compartilhamento e Segurança</h2>
              <p>
                Não compartilhamos seus dados com terceiros para fins comerciais. Os dados são armazenados em servidores seguros com criptografia e protocolos de proteção rigorosos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies e Publicidade</h2>
              <p>
                Este site utiliza o <strong>Google AdSense</strong> para exibição de anúncios. O Google, como fornecedor terceirizado, usa cookies para exibir anúncios com base nas visitas anteriores do usuário a este e a outros sites. O uso do cookie DART pelo Google permite que ele exiba anúncios para os visitantes com base na visita que fizeram a este site e/ou a outros sites na Internet.
              </p>
              <p className="mt-4">
                Os usuários podem desativar o uso do cookie DART acessando a Política de privacidade da rede de conteúdo e dos anúncios do Google em: <br />
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  https://policies.google.com/technologies/ads
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Ferramentas Analíticas e Terceiros</h2>
              <p>
                Além do Google AdSense, este site pode utilizar ferramentas analíticas como Google Analytics para entender o tráfego do site. As políticas de privacidade dessas ferramentas podem ser acessadas em: <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  https://policies.google.com/privacy
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Contato</h2>
              <p>
                Para dúvidas sobre esta política, solicitações relacionadas aos seus dados ou exercício de direitos da LGPD, entre em contato através de nossa página de <a href="/contato" className="text-accent hover:underline">Contato</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
