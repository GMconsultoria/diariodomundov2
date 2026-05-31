"use client";

import { useEffect, useRef } from "react";

import { ADSENSE_PUBLISHER_ID } from "@shared/const";

interface AdSenseUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  /** Estilo aplicado à tag <ins> (ex: width, minHeight). Não afeta o wrapper. */
  style?: React.CSSProperties;
  className?: string;
  layout?: string;
}

/**
 * Unidade de anúncio Google AdSense.
 * Só inicializa o slot após o script adsbygoogle.js estar disponível
 * (ou seja, após o usuário aceitar cookies via CookieBanner).
 */
export default function AdSenseUnit({
  slot,
  format = "auto",
  style,
  className,
  layout,
}: AdSenseUnitProps) {
  const initialized = useRef(false);

  useEffect(() => {
    const pushAd = () => {
      if (initialized.current) return;
      if (typeof (window as any).adsbygoogle === "undefined") return;
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        initialized.current = true;
      } catch (e) {
        console.warn("AdSense unit push error:", e);
      }
    };

    // Tentar imediatamente (script já carregado)
    pushAd();

    // Verificar a cada 300ms, desistir após 30s
    const MAX_WAIT_MS = 30_000;
    const start = Date.now();
    const scriptCheck = setInterval(() => {
      if (Date.now() - start > MAX_WAIT_MS) {
        clearInterval(scriptCheck);
        return;
      }
      if (typeof (window as any).adsbygoogle !== "undefined") {
        clearInterval(scriptCheck);
        pushAd();
      }
    }, 300);

    // Ouvir evento de consentimento do CookieBanner
    const handleConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ value: string }>).detail;
      if (detail?.value === "accepted") {
        // Aguardar o script do AdSense ser injetado e carregado
        setTimeout(pushAd, 800);
      }
    };
    window.addEventListener("cookie_consent_changed", handleConsent);

    return () => {
      clearInterval(scriptCheck);
      window.removeEventListener("cookie_consent_changed", handleConsent);
    };
  }, [slot]);

  return (
    <div className={`ad-container overflow-hidden ${className || ""}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 text-center select-none">
        Publicidade
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { "data-ad-layout": layout } : {})}
      />
    </div>
  );
}
