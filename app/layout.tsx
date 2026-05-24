import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./_providers";

const GA_ID = "G-J45K1R1867";
const BASE_URL = "https://www.diariodomundo.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Diário do Mundo | Notícias Independentes",
    template: "%s | Diário do Mundo",
  },
  description:
    "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia.",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Consent Mode v2 — must fire before ANY Google script */}
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

        {/* Google Analytics 4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('config', '${GA_ID}', { send_page_view: false });
            `.trim(),
          }}
        />

        {/* ads.txt verification */}
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
