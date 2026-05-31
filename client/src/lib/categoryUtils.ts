/**
 * Convert category name to URL slug
 * Example: "Ciência e Tecnologia" -> "ciencia-e-tecnologia"
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-");
}


/**
 * Get category link path
 */
export function getCategoryLink(category: string): string {
  return `/categoria/${categoryToSlug(category)}`;
}
