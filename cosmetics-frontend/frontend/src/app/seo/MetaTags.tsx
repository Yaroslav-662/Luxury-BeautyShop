import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "./SeoConfig";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  overrideSiteName?: boolean;
}

export const MetaTags = ({
  title,
  description,
  image,
  url,
  overrideSiteName = false
}: MetaTagsProps) => {
  const finalTitle = overrideSiteName
    ? title || SEO_CONFIG.title
    : title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.title;

  const finalDescription = description || SEO_CONFIG.description;
  const finalImage = image || SEO_CONFIG.image;
  const finalUrl = url || SEO_CONFIG.url;

  return (
    <Helmet>
      <title>{finalTitle}</title>

      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={SEO_CONFIG.keywords.join(", ")} />
      <meta name="author" content="BeautyShop" />
      <meta name="theme-color" content="#d4af37" />

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};
