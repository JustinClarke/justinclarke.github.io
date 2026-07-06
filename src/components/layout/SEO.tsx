/**
 * SEO sets the page's <title> and the social/search meta tags for whatever
 * page renders it.
 *
 * Fits in: drop one <SEO .../> near the top of each page with its own title,
 *          description, and share image.
 * Note:    it writes into the document <head>, not the visible page react-helmet
 *          handles that. It also renders <Schema> for structured search data.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Schema } from './Schema';
import { useTheme } from '@/app/providers';
import { SEO_THEME_COLORS } from '@/config/constants';
import { SITE } from '@/content';

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
  title = SITE.defaultTitle,
  description = SITE.defaultDescription,
  image,
  imageAlt = SITE.ogImageAlt,
  path = '/',
  type = 'website',
  schemaType,
}) => {
  const { resolvedTheme } = useTheme();
  const themeColor = resolvedTheme === 'dark' ? SEO_THEME_COLORS.dark : SEO_THEME_COLORS.light;
  const siteTitle = title;
  const canonicalUrl = `${SITE.url}${path}`;
  const ogImage = image
    ? (image.startsWith('http') ? image : `${SITE.url}${image}`)
    : `${SITE.url}${SITE.ogImage}`;

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
        <meta name="author" content={SITE.name} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={SITE.name} />
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
