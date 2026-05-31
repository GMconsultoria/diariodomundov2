"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Disable SSR for the admin portal since it's a heavily client-side SPA with its own Wouter routing.
const AdminApp = dynamic(() => import("@/pages/admin/AdminLayout"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="animate-spin text-accent" size={40} />
    </div>
  ),
});

export default function AdminPage() {
  return <AdminApp />;
}
