/**
 * Sanitiza HTML de artigos no lado do servidor (SSR-safe).
 *
 * Remove tags e atributos que podem ser usados para XSS, mantendo
 * a formatação editorial normal (parágrafos, listas, links, imagens, etc.).
 *
 * Em produção, considere usar a lib `sanitize-html` (npm) para cobertura completa.
 * Esta implementação cobre os vetores mais comuns para conteúdo editorial.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";

  return html
    // Remover <script> e conteúdo
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remover <iframe>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    // Remover <object>, <embed>, <form>
    .replace(/<(object|embed|form|input|button|select|textarea)\b[^>]*>.*?<\/\1>/gi, "")
    .replace(/<(object|embed|form|input|button|select|textarea)\b[^>]*(\/?)>/gi, "")
    // Remover atributos de evento (onclick, onload, onerror, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // Remover javascript: em href/src/action
    .replace(/\s+(href|src|action|data)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, "")
    // Remover data: URIs em atributos (vetor de XSS via SVG)
    .replace(/\s+(href|src)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, "")
    // Remover comentários HTML condicionais (vetor IE)
    .replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, "");
}
