import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "./SeoConfig";

interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const OpenGraph = ({
  title,
  description,
  image,
  url,
  type = "website"
}: OpenGraphProps) => {
  const finalTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.title;

  const finalDescription = description || SEO_CONFIG.description;
  const finalImage = image || SEO_CONFIG.image;
  const finalUrl = url || SEO_CONFIG.url;

  return (
    <Helmet>
      {/* OpenGraph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={type} />

      {/* Extended OG */}
      <meta property="og:locale" content="uk_UA" />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};
