/**
 * SEO sets the page's <title> and the social/search meta tags for whatever
 * page renders it.
 *
 * Fits in: drop one <SEO .../> near the top of each page with its own title,
 *          description, and share image.
 * Note:    it writes into the document <head>, not the visible page react-helmet
 *          handles that. It also renders <Schema> for structured search data.
 *
 * For beginners ----------------------------------------------------------------
 * <Helmet> is a component whose children are <title>/<meta> tags it hoists them
 * into the page's <head> for you. The defaults in the function signature
 * (title = '...', path = '/') are used whenever a page doesn't pass that prop.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Schema } from './Schema';
import { useTheme } from '@/app/providers';

const SITE_URL = 'https://justinclarke.github.io';
const DEFAULT_OG = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  path?: string;
  type?: 'website' | 'article';
  schemaType?: 'Person' | 'CreativeWork' | 'SoftwareApplication';
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Justin Clarke ⋅ Analytics Engineer ⋅ Full-Stack',
  description = 'Portfolio of Justin Clarke. Case studies in analytics engineering, data architecture, and high-fidelity data systems - built with SQL, Python, and React.',
  image,
  imageAlt = 'Justin Clarke - Analytics Engineer portfolio',
  path = '/',
  type = 'website',
  schemaType,
}) => {
  const { resolvedTheme } = useTheme();
  const themeColor = resolvedTheme === 'dark' ? '#050505' : '#ffffff'; // tw-allow-hex
  const siteTitle = title;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : DEFAULT_OG;

  return (
    <>
      <Schema 
        type={schemaType ?? (type === 'website' ? 'Person' : 'CreativeWork')}
        name={title}
        description={description}
        image={ogImage}
        url={canonicalUrl}
      />
      <Helmet>
        {/* Standard Metadata */}
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content="Justin Clarke" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="Justin Clarke" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={imageAlt} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={imageAlt} />

        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content={themeColor} />
      </Helmet>
    </>
  );
};
