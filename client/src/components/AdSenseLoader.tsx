import { useEffect, useState } from "react";
import { ADSENSE_ID } from "@/const";

/**
 * Loads the Google AdSense script ONLY after the user has accepted cookies.
 * This ensures LGPD compliance — no marketing scripts run before consent.
 */
export default function AdSenseLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent !== "accepted" || loaded) return;

    // Check if script is already loaded
    const existing = document.querySelector(
      `script[src*="adsbygoogle.js"]`
    );
    if (existing) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [loaded]);

  // Also listen for consent changes (when user clicks accept in the banner)
  useEffect(() => {
    const handleStorageChange = () => {
      const consent = localStorage.getItem("cookie_consent");
      if (consent === "accepted" && !loaded) {
        setLoaded(false); // trigger re-run of the loading effect
        // Force a re-render
        setTimeout(() => setLoaded(false), 0);
      }
    };

    window.addEventListener("cookie_consent_changed", handleStorageChange);
    return () => window.removeEventListener("cookie_consent_changed", handleStorageChange);
  }, [loaded]);

  return null;
}
