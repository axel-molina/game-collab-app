import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEO({
  title,
  description,
  image = "/assets/icon.png",
  url = "https://gamecollab.site",
  type = "website",
}: SEOProps) {
  const { t, i18n } = useTranslation();

  const defaultTitle = "GameCollab - Conectando desarrolladores";
  const defaultDescription =
    "Plataforma para conectar desarrolladores de videojuegos y colaborar en proyectos.";

  const seoTitle = title ? `${title} | GameCollab` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const siteUrl = "https://gamecollab.site";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
