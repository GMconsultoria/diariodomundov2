"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { GA_MEASUREMENT_ID, ADSENSE_PUBLISHER_ID } from "@shared/const";

const CONSENT_KEY = "cookie_consent";
const CONSENT_DURATION_DAYS = 180;

interface ConsentData {
  value: "accepted" | "rejected";
  timestamp: number;
}

function getStoredConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentData;
    if (!parsed.timestamp || !parsed.value) return null;
    const elapsed = Date.now() - parsed.timestamp;
    const maxAge = CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
    if (elapsed >= maxAge) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Atualiza o Google Consent Mode v2 e carrega o AdSense se aceito. */
function applyConsent(value: "accepted" | "rejected") {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    if (value === "accepted") {
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      gtag("config", GA_MEASUREMENT_ID, { page_path: window.location.pathname });
    } else {
      gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  }

  // Carregar script do AdSense apenas após aceitação
  if (value === "accepted") {
    
    const existing = document.querySelector('script[src*="adsbygoogle.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // Inicializar todos os slots pendentes
        try {
          const slots = document.querySelectorAll(".adsbygoogle[data-ad-slot]:not([data-adsbygoogle-status])");
          slots.forEach(() => {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          });
        } catch (e) {
          console.warn("AdSense init error:", e);
        }
      };
      document.head.appendChild(script);
    }
  }

  // Notificar outros componentes
  window.dispatchEvent(new CustomEvent("cookie_consent_changed", { detail: { value } }));
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      // Reaplicar o consentimento salvo ao carregar a página
      applyConsent(stored.value);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (value: "accepted" | "rejected") => {
    const data: ConsentData = { value, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    applyConsent(value);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-card border border-border shadow-2xl rounded-2xl p-6 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="pr-6">
          <h3 className="font-bold text-lg mb-2">Respeitamos sua privacidade 🍪</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Utilizamos cookies para melhorar sua experiência e exibir anúncios personalizados via{" "}
            <strong>Google AdSense</strong>. Os cookies de publicidade só serão ativados com seu
            consentimento, conforme a <strong>LGPD</strong>.{" "}
            <Link href="/politica-de-privacidade" className="text-accent hover:underline">
              Saiba mais
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => saveConsent("accepted")}
              className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-accent/20"
            >
              Aceitar Todos
            </button>
            <button
              onClick={() => saveConsent("rejected")}
              className="w-full py-2.5 bg-muted text-foreground rounded-lg font-bold text-sm hover:bg-border transition-colors border border-border"
            >
              Recusar Marketing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
