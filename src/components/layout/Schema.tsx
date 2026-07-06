/**
 * Schema injects a JSON-LD structured-data block into the page <head>.
 *
 * Fits in: rendered by SEO.tsx; one per page.
 * Note:    JSON-LD is metadata FOR SEARCH ENGINES, not shown to humans. It tells
 *          Google "this page is about a Person (or CreativeWork) named ..." so it
 *          can show richer results. The `type` prop picks which shape to emit.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE } from '@/content';

interface SchemaProps {
  type?: 'Person' | 'Project' | 'CreativeWork' | 'SoftwareApplication';
  name?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const Schema: React.FC<SchemaProps> = ({
  type = 'Person',
  name = SITE.name,
  description = 'Senior Analytics Engineer and Full-Stack Developer specialized in high-performance data systems.',
  image = `${SITE.url}${SITE.ogImage}`,
  url = SITE.url,
}) => {
  const jsonLd = type === 'Person'
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "description": description,
        "url": url,
        "image": image,
        "jobTitle": "Senior Analytics Engineer",
        "sameAs": [
          `https://github.com/${SITE.social.github}`,
          `https://linkedin.com/in/${SITE.social.linkedin}`
        ]
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": name,
        "description": description,
        "url": url,
        "image": image,
        "author": {
          "@type": "Person",
          "name": SITE.name
        }
      };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
