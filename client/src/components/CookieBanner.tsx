import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "cookie_consent";
const CONSENT_DURATION_DAYS = 180;

function isConsentValid(): boolean {
  const data = localStorage.getItem(CONSENT_KEY);
  if (!data) return false;
  try {
    const parsed = JSON.parse(data);
    if (!parsed.timestamp) return false;
    const elapsed = Date.now() - parsed.timestamp;
    const maxAge = CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
    return elapsed < maxAge;
  } catch {
    return false;
  }
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isConsentValid()) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (value: "accepted" | "rejected") => {
    const data = JSON.stringify({ value, timestamp: Date.now() });
    localStorage.setItem(CONSENT_KEY, data);
    // Also set simplified key for AdSenseLoader compatibility
    localStorage.setItem("cookie_consent", value);
    setIsVisible(false);
    // Dispatch custom event so AdSenseLoader can react immediately
    window.dispatchEvent(new Event("cookie_consent_changed"));
  };

  const acceptCookies = () => saveConsent("accepted");
  const rejectCookies = () => saveConsent("rejected");

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
            Utilizamos cookies para melhorar sua experiência e exibir anúncios personalizados via <strong>Google AdSense</strong>. 
            Os cookies de publicidade só serão ativados com seu consentimento, conforme a <strong>LGPD</strong>.{" "}
            <Link href="/politica-de-privacidade" className="text-accent hover:underline">
              Saiba mais
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={acceptCookies}
              className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-accent/20"
            >
              Aceitar Todos
            </button>
            <button 
              onClick={rejectCookies}
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
