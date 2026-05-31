const cloudinaryUrl = process.env.CLOUDINARY_URL ?? "";
let parsedCloudName = "";
let parsedApiKey = "";
let parsedApiSecret = "";

if (cloudinaryUrl.startsWith("cloudinary://")) {
  // Format: cloudinary://api_key:api_secret@cloud_name
  const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (match) {
    parsedApiKey = match[1];
    parsedApiSecret = match[2];
    parsedCloudName = match[3];
  }
}

const cookieSecret = process.env.JWT_SECRET;
if (!cookieSecret && process.env.NODE_ENV === "production") {
  if (process.env.VERCEL === "1") {
    throw new Error(
      "[FATAL] JWT_SECRET não está definido. Configure-o nas variáveis de ambiente da Vercel."
    );
  } else {
    console.warn(
      "[WARN] JWT_SECRET não está definido. O build local continuará usando um fallback, mas configure-o na Vercel para produção."
    );
  }
}

export const ENV = {
  cookieSecret: cookieSecret ?? "dev_only_secret_change_before_deploy",
  // Priority: DATABASE_URL → POSTGRES_URL (Vercel/Supabase integration) → POSTGRES_URL_NON_POOLING
  databaseUrl:
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  baseUrl: process.env.BASE_URL?.replace(/\/+$/, "") ?? "https://www.diariodomundo.com",
  contactEmail: process.env.CONTACT_EMAIL ?? "contato@diariodomundo.com",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || parsedCloudName,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || parsedApiKey,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || parsedApiSecret,
  // Supabase — injetadas automaticamente pela integração Vercel ↔ Supabase
  supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET ?? "",
};
