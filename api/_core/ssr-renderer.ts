import React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'path-to-regexp';

// Placeholder mapping of raw URLs to static HTML for crawler bots and general SSR.
// The actual React components are used to hydrate this. We need to fetch data and inject it into
// the static HTML.

interface SSRContext {
  url: string;
  template: string;
  dbData?: any;
}

export async function renderPageToString(ctx: SSRContext): Promise<string> {
  const { url, template, dbData } = ctx;
  
  // Replace standard React root div with the rendered content later.
  // For now, inject the meta tags into the template if we have data.
  
  let html = template;
  
  if (dbData && dbData.post) {
      const { post } = dbData;
      const title = `${post.title} | Diário do Mundo`;
      const description = post.subtitle || post.title;
      const imageUrl = post.imageUrl || "https://www.diariodomundo.com/og-image.png";
      const canonical = `https://www.diariodomundo.com/noticias/${post.slug}`;
      const publishedDate = post.publishedAt || post.createdAt;
      const modifiedDate = post.updatedAt || post.createdAt;
      
      const schemaOrg = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": post.title,
          "description": description,
          "image": [imageUrl],
          "datePublished": new Date(publishedDate).toISOString(),
          "dateModified": new Date(modifiedDate).toISOString(),
          "author": [{
            "@type": "Person",
            "name": post.author,
            "url": "https://www.diariodomundo.com/"
          }],
          "publisher": {
            "@type": "Organization",
            "name": "Diário do Mundo",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.diariodomundo.com/favicon.svg"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical
          }
      });

      // Inject title
      html = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
      
      // Inject standard meta description
      html = html.replace(
          /<meta name="description" content="(.*?)" \/>/, 
          `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
      );
      
      // Inject canonical
      html = html.replace(
          /<link rel="canonical" href="(.*?)" \/>/, 
          `<link rel="canonical" href="${canonical}" />`
      );
      
      // Inject Open Graph tags (by replacing existing ones)
      html = html.replace(
          /<meta property="og:title" content="(.*?)" \/>/,
          `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`
      );
      html = html.replace(
          /<meta property="og:description" content="(.*?)" \/>/,
          `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
      );
      html = html.replace(
          /<meta property="og:url" content="(.*?)" \/>/,
          `<meta property="og:url" content="${canonical}" />`
      );
      html = html.replace(
          /<meta property="og:image" content="(.*?)" \/>/,
          `<meta property="og:image" content="${imageUrl}" />`
      );
      html = html.replace(
          /<meta property="og:type" content="(.*?)" \/>/,
          `<meta property="og:type" content="article" />`
      );
      
      // Inject Schema.org
      const schemaScript = `<script type="application/ld+json">${schemaOrg}</script>`;
      // Add right before </head>
      html = html.replace('</head>', `  ${schemaScript}\n  </head>`);
      
      // We will also inject the article content to ensure google indexes it immediately
      // This is crucial for AdSense "Low value content" error.
      const articleContent = `
        <div style="display:none;" id="ssr-content">
            <h1>${post.title}</h1>
            <h2>${post.subtitle || ''}</h2>
            <div>Por ${post.author} em ${new Date(publishedDate).toLocaleDateString("pt-BR")}</div>
            <article>${post.content}</article>
        </div>
      `;
      html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${articleContent}`);

  } else if (dbData && dbData.page) {
    const { title, description } = dbData.page;
    const fullTitle = `${title} | Diário do Mundo`;
    const canonical = `https://www.diariodomundo.com${url}`;
    
    html = html.replace(/<title>(.*?)<\/title>/, `<title>${fullTitle}</title>`);
    html = html.replace(
        /<meta name="description" content="(.*?)" \/>/, 
        `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
    );
    html = html.replace(
        /<link rel="canonical" href="(.*?)" \/>/, 
        `<link rel="canonical" href="${canonical}" />`
    );
    html = html.replace(
        /<meta property="og:title" content="(.*?)" \/>/,
        `<meta property="og:title" content="${fullTitle.replace(/"/g, '&quot;')}" />`
    );
    html = html.replace(
        /<meta property="og:description" content="(.*?)" \/>/,
        `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
    );
    html = html.replace(
        /<meta property="og:url" content="(.*?)" \/>/,
        `<meta property="og:url" content="${canonical}" />`
    );
  }

  return html;
}
