import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export default function SEO({ title, description, path, image }: SEOProps) {
  const { pathname } = useLocation();
  const currentPath = path || pathname;
  
  const siteName = "LexVerma & Associates";
  const defaultTitle = `${siteName} | Top Advocates & Legal Experts`;
  const defaultDesc = "Premier law chamber in India handling High Court, Criminal, Civil, Family, and Corporate legal matters. Trusted legal experts protecting your rights.";
  const url = import.meta.env.APP_URL ? (import.meta.env.APP_URL.replace(/\/$/, '')) : "https://lexverma.law";
  const defaultImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000";

  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  const gscToken = import.meta.env.VITE_GSC_VERIFICATION_TOKEN;

  useEffect(() => {
    if (trackingId) {
      if (!ReactGA.isInitialized) {
        ReactGA.initialize(trackingId);
      }
      ReactGA.send({ hitType: "pageview", page: currentPath });
    }
  }, [currentPath, trackingId]);

  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDesc;
  const finalImage = image || defaultImage;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": siteName,
    "image": finalImage,
    "url": url,
    "telephone": "+919876543210",
    "email": "info@lexverma.law",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Legal Tower, High Court Road",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={`${url}${currentPath}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${url}${currentPath}`} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Google Search Console */}
      {gscToken && <meta name="google-site-verification" content={gscToken} />}

      {/* Local JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}
