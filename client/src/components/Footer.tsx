import Link from "next/link";
import { CATEGORIES } from "@shared/const";
import { getCategoryLink } from "@/lib/categoryUtils";

// ─────────────────────────────────────────────────────────────────────────────
// TODO: Preencha com as URLs reais das redes sociais do portal.
// Deixe a string vazia ("") para ocultar o link enquanto não tiver conta.
// ─────────────────────────────────────────────────────────────────────────────
const SOCIAL_LINKS = {
  facebook:  "",   // Ex.: "https://facebook.com/diariodomundo"
  twitter:   "",   // Ex.: "https://twitter.com/diariodomundo"
  instagram: "",   // Ex.: "https://instagram.com/diariodomundo"
  youtube:   "",   // Ex.: "https://youtube.com/@diariodomundo"
};

// TODO: Preencha com o CNPJ real após registrar a empresa
const CNPJ_DISPLAY = ""; // Ex.: "00.000.000/0001-00"

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const activeSocials = Object.entries(SOCIAL_LINKS).filter(([, url]) => url !== "");

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent">Diário do Mundo</h3>
            <p className="text-sm text-gray-300">
              Portal de notícias independente com cobertura completa de política, economia,
              tecnologia e muito mais.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase">Categorias</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={getCategoryLink(category)}
                    className="no-underline text-gray-300 hover:text-accent transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase">Institucional</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/sobre",                    label: "Sobre Nós" },
                { href: "/politica-editorial",       label: "Política Editorial" },
                { href: "/politica-de-privacidade",  label: "Política de Privacidade" },
                { href: "/termos",                   label: "Termos de Uso" },
                { href: "/contato",                  label: "Contato" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="no-underline text-gray-300 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais — só renderiza se tiver URLs reais */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase">Redes Sociais</h4>
            {activeSocials.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {activeSocials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline text-gray-300 hover:text-accent transition-colors capitalize"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Em breve</p>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            © {currentYear} Diário do Mundo. Todos os direitos reservados.
          </p>
          {CNPJ_DISPLAY && (
            <p className="text-xs text-gray-500">CNPJ: {CNPJ_DISPLAY}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
