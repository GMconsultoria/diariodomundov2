import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Leia os termos de uso do Diário do Mundo. Saiba seus direitos e deveres ao acessar nosso portal de notícias.",
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
            <div className="w-12 h-1 bg-accent rounded" />
          </div>
          <div className="space-y-6 text-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceitação dos Termos</h2>
              <p>Ao acessar e usar o Diário do Mundo, você concorda em estar vinculado por estes Termos de Uso.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso Licenciado</h2>
              <p>É concedida a você uma licença limitada, não exclusiva e revogável para acessar e usar o Site para fins pessoais e não comerciais.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Isenção de Responsabilidade</h2>
              <p>O Site é fornecido "no estado em que se encontra" sem garantias de qualquer tipo. Você usa o Site por sua conta e risco.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitação de Responsabilidade</h2>
              <p>Em nenhum caso o Diário do Mundo será responsável por danos indiretos, incidentais, especiais ou consequentes decorrentes do seu uso ou incapacidade de usar o Site.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Conteúdo do Usuário</h2>
              <p>Você é responsável por qualquer conteúdo que enviar. Você concorda que não enviará conteúdo ofensivo, ilegal ou que viole direitos de terceiros.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Propriedade Intelectual</h2>
              <p>Todo o conteúdo do Site é protegido por leis de direitos autorais.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Links Externos</h2>
              <p>Não somos responsáveis pelo conteúdo, precisão ou práticas de privacidade de sites de terceiros.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Modificações dos Termos</h2>
              <p>Reservamos o direito de modificar estes Termos a qualquer momento. Alterações entram em vigor assim que publicadas.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Privacidade e Proteção de Dados</h2>
              <p>O uso do site está sujeito à nossa Política de Privacidade, em conformidade com a LGPD.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Lei Aplicável</h2>
              <p>Estes Termos são regidos pelas leis do Brasil (LGPD, Marco Civil). Jurisdição exclusiva dos tribunais brasileiros.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
