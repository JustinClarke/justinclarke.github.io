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
  description = 'Senior Analytics Engineer and Data Architect specialized in high-performance data systems.',
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
