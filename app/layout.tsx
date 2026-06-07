import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./_providers";
import { GA_MEASUREMENT_ID } from "@shared/const";

const BASE_URL = "https://www.diariodomundo.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Diário do Mundo | Notícias Independentes",
    template: "%s | Diário do Mundo",
  },
  description:
    "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    siteName: "Diário do Mundo",
    type: "website",
    locale: "pt_BR",
    images: [{ url: `${BASE_URL}/og-image.png` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@diariodomundo",
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "google-adsense-account": "ca-pub-1426811176615814",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/*
          PASSO 1 — Google Consent Mode v2
          Deve ser o PRIMEIRO script da página, antes de qualquer script do Google.
          Define consentimento negado por padrão; o CookieBanner faz o 'update' após aceite.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
            `.trim(),
          }}
        />

        {/*
          PASSO 2 — Google Analytics 4
          O script async carrega o GA4; a config reutiliza o gtag já definido acima.
        */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
