/**
 * Schema injects a JSON-LD structured-data block into the page <head>.
 *
 * Fits in: rendered by SEO.tsx; one per page.
 * Note:    JSON-LD is metadata FOR SEARCH ENGINES, not shown to humans. It tells
 *          Google "this page is about a Person (or CreativeWork) named ..." so it
 *          can show richer results. The `type` prop picks which shape to emit.
 *
 * For beginners ----------------------------------------------------------------
 * JSON.stringify turns the plain JS object into a JSON text string, which goes
 * inside a <script type="application/ld+json"> tag the standard way to embed
 * machine-readable data in a page.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaProps {
  type?: 'Person' | 'Project' | 'CreativeWork' | 'SoftwareApplication';
  name?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const Schema: React.FC<SchemaProps> = ({
  type = 'Person',
  name = 'Justin Clarke',
  description = 'Senior Analytics Engineer and Full-Stack Developer specialized in high-performance data systems.',
  image = 'https://justinclarke.github.io/og-image.png',
  url = 'https://justinclarke.github.io',
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
          "https://github.com/JustinClarke",
          "https://linkedin.com/in/justinsavioclarke"
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
          "name": "Justin Clarke"
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
