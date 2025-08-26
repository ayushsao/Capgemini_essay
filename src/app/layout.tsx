import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { siteConfig, structuredData } from "@/config/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI Essay Writing Tutor`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
    creator: siteConfig.author.twitter,
    site: siteConfig.author.twitter,
  },
  verification: {
    google: siteConfig.seo.googleSiteVerification,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-US': siteConfig.url,
    },
  },
  category: 'education',
  classification: 'Educational Technology',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.seo.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
    startupImage: [
      '/apple-splash-2048-2732.jpg',
      '/apple-splash-1668-2224.jpg',
      '/apple-splash-1536-2048.jpg',
      '/apple-splash-1125-2436.jpg',
      '/apple-splash-828-1792.jpg',
      '/apple-splash-750-1334.jpg',
    ],
  },
  applicationName: siteConfig.name,
  appLinks: {
    web: {
      url: siteConfig.url,
      should_fallback: true,
    },
  },
  archives: [`${siteConfig.url}/sitemap.xml`],
  assets: [`${siteConfig.url}/assets`],
  bookmarks: [`${siteConfig.url}/resources`],
  generator: 'Next.js',
  manifest: '/manifest.json',
  other: {
    'google-adsense-account': siteConfig.adsense.publisherId,
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': siteConfig.seo.themeColor,
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'target': 'all',
    'audience': 'all',
    'distribution': 'Global',
    'rating': 'General',
    'revisit-after': '1 day',
    'subject': 'AI Essay Writing Tutor and Academic Assistant',
    'summary': siteConfig.description,
    'designer': siteConfig.author.name,
    'owner': siteConfig.author.name,
    'url': siteConfig.url,
    'identifier-URL': siteConfig.url,
    'directory': 'submission',
    'pagename': siteConfig.name,
    'category': 'Education, AI, Writing, Academic',
    'copyright': `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
    'author': siteConfig.author.name,
    'reply-to': siteConfig.author.email,
    'abstract': siteConfig.description,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-3012568998879634" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://essaytude.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Essaytude',
              description: 'AI-powered essay writing tutor and academic assistant',
              url: 'https://essaytude.com',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Any',
              author: {
                '@type': 'Person',
                name: 'Ayush Kumar Sao'
              },
              provider: {
                '@type': 'Organization',
                name: 'Essaytude',
                url: 'https://essaytude.com'
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              }
            })
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Performance Monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring
              if (typeof window !== 'undefined') {
                // Track Core Web Vitals
                function trackWebVitals() {
                  if ('PerformanceObserver' in window) {
                    // Largest Contentful Paint
                    new PerformanceObserver((entryList) => {
                      const entries = entryList.getEntries();
                      const lastEntry = entries[entries.length - 1];
                      console.log('LCP:', lastEntry.startTime);
                    }).observe({entryTypes: ['largest-contentful-paint']});

                    // First Input Delay
                    new PerformanceObserver((entryList) => {
                      const firstInput = entryList.getEntries()[0];
                      if (firstInput) {
                        const fid = firstInput.processingStart - firstInput.startTime;
                        console.log('FID:', fid);
                      }
                    }).observe({entryTypes: ['first-input']});

                    // Cumulative Layout Shift
                    new PerformanceObserver((entryList) => {
                      let clsValue = 0;
                      for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                          clsValue += entry.value;
                        }
                      }
                      console.log('CLS:', clsValue);
                    }).observe({entryTypes: ['layout-shift']});
                  }
                }
                
                // Start tracking when page loads
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', trackWebVitals);
                } else {
                  trackWebVitals();
                }
              }
            `
          }}
        />
      </body>
    </html>
  );
}
