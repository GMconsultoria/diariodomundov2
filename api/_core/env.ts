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

export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "default_secret",
  databaseUrl: process.env.DATABASE_URL ?? "",
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
};

