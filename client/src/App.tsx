import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Login from "./pages/Login";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import CookieBanner from "./components/CookieBanner";
import AdSenseLoader from "./components/AdSenseLoader";
import { useEffect, Suspense, lazy } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));

// Analytics tracker for SPA navigation
function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    // Track GA4
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-EXGCVYWJZ1", {
        page_path: location,
      });
    }

    // Refresh AdSense (Auto Ads) for SPA
    try {
      if (typeof (window as any).adsbygoogle !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense refresh error:", e);
    }
  }, [location]);

  return null;
}

// Add gtag to Window interface
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path={"/noticias/:slug"} component={Article} />
      <Route path={"/categoria/:category"} component={Category} />
      <Route path={"/busca"} component={Search} />
      <Route path="/sobre" component={About} />
      <Route path="/privacidade" component={Privacy} />
      <Route path="/politica-de-privacidade" component={Privacy} />
      <Route path="/termos" component={Terms} />
      <Route path="/contato" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/admin/*">{() => <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" size={40} /></div>}><AdminLayout /></Suspense>}</Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AnalyticsTracker />
          <AdSenseLoader />
          <Toaster />
          <Router />
          <CookieBanner />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Diário do Mundo",
              "url": "https://www.diariodomundo.com/",
              "logo": "https://www.diariodomundo.com/favicon.svg"
            }) }} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
