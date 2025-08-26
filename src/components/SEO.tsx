'use client';

import Head from 'next/head';
import { siteConfig, structuredData } from '@/config/metadata';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SEO({
  title = siteConfig.title,
  description = siteConfig.description,
  canonical = siteConfig.url,
  keywords = siteConfig.keywords,
  image = siteConfig.ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = siteConfig.author.name,
  section,
  tags,
  noindex = false,
  nofollow = false
}: SEOProps) {
  const fullTitle = title === siteConfig.title ? title : `${title} | ${siteConfig.name}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content={siteConfig.author.twitter} />
      <meta name="twitter:site" content={siteConfig.author.twitter} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content={siteConfig.seo.themeColor} />
      <meta name="msapplication-TileColor" content={siteConfig.seo.themeColor} />
      <meta name="application-name" content={siteConfig.name} />
      <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Verification Tags */}
      {siteConfig.seo.googleSiteVerification && (
        <meta name="google-site-verification" content={siteConfig.seo.googleSiteVerification} />
      )}
      {siteConfig.seo.bingSiteVerification && (
        <meta name="msvalidate.01" content={siteConfig.seo.bingSiteVerification} />
      )}
      
      {/* AdSense Tags */}
      {siteConfig.adsense.enabled && (
        <meta name="google-adsense-account" content={siteConfig.adsense.publisherId} />
      )}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.website)
        }}
      />
      
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.webApplication)
          }}
        />
      )}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization)
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.groq.com" />
      <link rel="preconnect" href="https://api.together.xyz" />
      <link rel="preconnect" href="https://api.openrouter.ai" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Resource hints */}
      <link rel="prefetch" href="/api/essay-analysis" />
      <link rel="prefetch" href="/api/grammar-check" />
    </Head>
  );
}
