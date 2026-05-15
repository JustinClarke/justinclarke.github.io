# 03: Metadata & Social Graph

## 🔴 Current Defects
1. **Relative URLs**: Social platforms (LinkedIn, Twitter) require *absolute* URLs for images.
2. **Missing Dimensions**: Platforms won't render "Large Cards" without explicit width/height meta tags.
3. **Invalid Schema**: `@type: "Project"` is not a standard schema.org type. Use `CreativeWork`.

## 🛠 Refactored SEO Component (`SEO.tsx`)
Replace your current `SEO.tsx` logic with this production-grade version:

```tsx
import { Helmet } from 'react-helmet-async';
import { Schema } from './Schema';

const SITE_URL = 'https://justinclarke.github.io';
const DEFAULT_OG = `${SITE_URL}/og-image.png`;

export const SEO: React.FC<SEOProps> = ({
  title = 'Justin Clarke — Analytics Engineer & Data Architect',
  description = 'Portfolio of Justin Clarke. Case studies in analytics engineering...',
  image,
  path = '/',
  type = 'website',
}) => {
  const siteTitle = title.includes('Justin Clarke') ? title : `${title} | Justin Clarke`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_OG;

  return (
    <>
      <Schema
        type={type === 'website' ? 'Person' : 'CreativeWork'}
        name={title}
        description={description}
        image={ogImage}
        url={canonicalUrl}
      />
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#050505" />
      </Helmet>
    </>
  );
};
```

## ✍️ Meta Description Formulas
**Pattern**: Outcome + Keyword + Artefact.

*   **SQL Disaster**: `SQL case study: an 11-entity relational database modeling Philippine disaster relief logistics — composite keys and live dashboard. Full ERD inside.`
*   **HR Archetype**: `AI-driven HR analytics: an 8-archetype retention engine that predicts employee attrition 90 days out using Gemini and Firestore.`
