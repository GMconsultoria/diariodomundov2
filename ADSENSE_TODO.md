# ✅ Checklist AdSense — Ações Manuais Necessárias

Este arquivo lista as ações que **você precisa fazer manualmente** antes de submeter
o site para revisão do Google AdSense. O código técnico já foi corrigido nesta versão.

---

## 🔴 CRÍTICO — Fazer antes de subir o site

### 1. Corrigir erro HTTP 500 (infraestrutura)
- No painel da **Vercel**, vá em Settings > Environment Variables
- Confirme que as seguintes variáveis estão configuradas para o ambiente **Production**:
  - `DATABASE_URL` — string de conexão PostgreSQL
  - `NEXTAUTH_SECRET` (ou equivalente de autenticação)
  - Qualquer outra variável usada em `api/db.ts`
- Após configurar, faça um novo deploy e confirme HTTP 200 em `https://www.diariodomundo.com`

### 2. Preencher dados reais em `app/sobre/page.tsx`
Abra o arquivo e substitua todos os campos marcados com `TODO:`:
- `FOUNDED_YEAR` — ano real de fundação do portal
- `CNPJ_REAL` — CNPJ real da empresa/pessoa jurídica
- `ADDRESS` — endereço completo da sede
- `TEAM[0].name` — nome real do editor-chefe
- `TEAM[0].bio` — bio profissional real (mínimo 3 frases)
- `TEAM[0].social` — link do LinkedIn real (opcional)
- Adicione mais membros da equipe conforme necessário

### 3. Preencher CNPJ no `Footer.tsx`
- Abra `client/src/components/Footer.tsx`
- Substitua o comentário `{/* TODO: inserir CNPJ real */}` pelo CNPJ formatado

### 4. Criar contas reais nas redes sociais
- Abra `client/src/components/Footer.tsx`
- Preencha `SOCIAL_LINKS` com as URLs reais:
  ```ts
  const SOCIAL_LINKS = {
    facebook:  "https://facebook.com/diariodomundo",
    twitter:   "https://twitter.com/diariodomundo",
    instagram: "https://instagram.com/diariodomundo",
    youtube:   "",
  };
  ```

---

## 🟠 ALTO — Fazer antes de submeter para revisão do AdSense

### 5. Substituir slots AdSense pelos IDs reais

Você precisa criar as unidades de anúncio no painel do AdSense
(**AdSense > Anúncios > Por unidade de anúncio > Criar nova unidade**) e
substituir os placeholders nos seguintes arquivos:

#### `app/page.tsx` (homepage)
```ts
const AD_SLOT_HOMEPAGE_BANNER = "XXXXXXXXXX"; // ← substitua
const AD_SLOT_HOMEPAGE_BOTTOM = "YYYYYYYYYY"; // ← substitua
```

#### `app/noticias/[slug]/page.tsx` (artigos)
```ts
const AD_SLOT_ARTICLE_TOP    = "AAAAAAAAAA"; // ← substitua
const AD_SLOT_ARTICLE_MID    = "BBBBBBBBBB"; // ← substitua
const AD_SLOT_ARTICLE_BOTTOM = "CCCCCCCCCC"; // ← substitua
```

#### `app/categoria/[category]/page.tsx` (categorias)
```ts
const AD_SLOT_CATEGORY = "DDDDDDDDDD"; // ← substitua
```

### 6. Confirmar Publisher ID
- Verifique que `shared/const.ts` contém o seu Publisher ID correto:
  `ADSENSE_ID = "ca-pub-1426811176615814"`
- Se diferente, atualize em `shared/const.ts` e em `public/ads.txt`

### 7. Publicar mínimo de conteúdo
- O Google exige conteúdo substancial antes de aprovar.
- Publique pelo menos **20-30 artigos** com no mínimo **400 palavras cada**
- Os artigos devem ser originais, não copiados de outras fontes

---

## 🟡 MÉDIO — Boas práticas adicionais

### 8. Substituir o DPO na Política de Privacidade
- Em `app/politica-de-privacidade/page.tsx`, substitua `(a preencher)` pelo CNPJ real

### 9. Verificar Google Search Console
- Acesse https://search.google.com/search-console
- Adicione a propriedade `https://www.diariodomundo.com`
- Submita o sitemap: `https://www.diariodomundo.com/sitemap.xml`
- Aguarde indexação antes de submeter para o AdSense

### 10. Validar ads.txt
- Acesse `https://www.diariodomundo.com/ads.txt`
- Deve retornar: `google.com, pub-1426811176615814, DIRECT, f08c47fec0942fa0`

---

## ✅ Já corrigido nesta versão do código

| Item | Status |
|------|--------|
| Favicon (favicon.ico + favicon.svg) | ✅ Criado |
| Layout.tsx — favicon metadata | ✅ Corrigido |
| CookieBanner — Consent Mode v2 integrado corretamente | ✅ Corrigido |
| AdSenseLoader — bug de double-setLoaded corrigido | ✅ Corrigido |
| AdSenseUnit — carregamento robusto após consentimento | ✅ Corrigido |
| AdSpace — Publisher ID placeholder removido | ✅ Corrigido |
| Homepage — div placeholder substituído por AdSenseUnit real | ✅ Corrigido |
| Artigos (/noticias/[slug]) — 3 slots AdSense adicionados | ✅ Corrigido |
| Artigos — campo "Atualizado em" visível | ✅ Corrigido |
| Artigos — box de autor adicionado | ✅ Corrigido |
| Sobre — estrutura completa com campos reais (aguarda preenchimento) | ✅ Corrigido |
| Footer — links href="#" das redes sociais removidos | ✅ Corrigido |
| Footer — link para Política Editorial adicionado | ✅ Corrigido |
| Política Editorial — página criada | ✅ Criado |
| Termos de Uso — expandidos com cláusulas de publicidade e DMCA | ✅ Corrigido |
| Política de Privacidade — expandida com tabela LGPD e Consent Mode v2 | ✅ Corrigido |
| Categorias — paginação de 12 artigos por página implementada | ✅ Corrigido |
| robots.ts — /login bloqueado, host adicionado | ✅ Corrigido |
| sitemap.ts — /politica-editorial incluída | ✅ Corrigido |

---

## 🗓 Sequência recomendada para aprovação

1. **Semana 1**: Resolver HTTP 500 + preencher dados reais (CNPJ, equipe, redes sociais)
2. **Semana 2**: Publicar artigos originais (mínimo 20-30) + criar unidades no AdSense
3. **Semana 3**: Configurar Search Console + verificar indexação + substituir slots
4. **Semana 4**: Revisão final com este checklist → Submeter para aprovação

Após submeter, a revisão do Google AdSense leva geralmente **3 a 14 dias**.
