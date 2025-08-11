import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
}

const SEO = ({ title, description, canonicalPath }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    // Meta description
    const metaDescName = 'description';
    let meta = document.querySelector(`meta[name="${metaDescName}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = metaDescName;
      document.head.appendChild(meta);
    }
    if (description) meta.content = description;

    // Canonical link
    if (canonicalPath) {
      const href = `${window.location.origin}${canonicalPath}`;
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = href;
    }
  }, [title, description, canonicalPath]);

  return null;
};

export default SEO;
