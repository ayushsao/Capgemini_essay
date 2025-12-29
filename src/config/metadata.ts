// SEO and Metadata Configuration for Essaytude
export const siteConfig = {
  name: "Essaytude",
  title: "Essaytude - Professional AI Essay Writing Tutor & Academic Assistant",
  description: "Enhance your academic writing with Essaytude's AI-powered essay analysis, grammar checking, plagiarism detection, and personalized feedback. Perfect for students seeking to improve their writing skills.",
  url: process.env.NODE_ENV === 'production' ? 'https://essaytude.com' : 'http://localhost:3000',
  ogImage: "/og-image.jpg",
  twitterImage: "/twitter-image.jpg",
  
  keywords: [
    "essay writing tutor",
    "AI essay analysis", 
    "academic writing assistant",
    "grammar checker",
    "plagiarism detection",
    "essay feedback",
    "writing improvement",
    "student writing support",
    "essay scoring",
    "academic integrity",
    "writing skills development",
    "AI writing coach",
    "essay grading",
    "academic success",
    "writing enhancement"
  ],

  author: {
    name: "Ayush Kumar Sao",
    twitter: "@essaytude",
    email: "support@essaytude.com"
  },

  social: {
    twitter: "https://twitter.com/essaytude",
    github: "https://github.com/ayushsao/essaytude",
    linkedin: "https://linkedin.com/in/ayushsao"
  },

  // AdSense Configuration
  adsense: {
    publisherId: "ca-pub-3012568998879634",
    enabled: process.env.NODE_ENV === 'production'
  },

  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID
  },

  // Feature flags
  features: {
    chatbot: true,
    aiAnalysis: true,
    grammarCheck: true,
    plagiarismDetection: true,
    realTimeAnalysis: true
  },

  // SEO Configuration
  seo: {
    canonicalUrl: process.env.NODE_ENV === 'production' ? 'https://essaytude.com' : 'http://localhost:3000',
    themeColor: "#3B82F6",
    robots: "index,follow",
    googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
    bingSiteVerification: process.env.BING_SITE_VERIFICATION
  }
};

// Structured Data Schemas
export const structuredData = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  },

  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      email: siteConfig.author.email
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        email: siteConfig.author.email,
        contactType: 'Customer Service'
      }
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    featureList: [
      'AI-powered essay analysis',
      'Grammar and spell checking',
      'Plagiarism detection',
      'Real-time feedback',
      'Writing improvement suggestions',
      'Academic integrity tools'
    ]
  },

  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: siteConfig.author.name
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.author.email,
      contactType: 'Customer Support'
    },
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.github,
      siteConfig.social.linkedin
    ]
  },

  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Essay Writing Assistance',
    description: 'Professional AI-powered essay analysis and writing improvement service',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    },
    serviceType: 'Educational Technology Service',
    areaServed: 'Worldwide',
    audience: {
      '@type': 'EducationalAudience',
      audienceType: ['Students', 'Academics', 'Researchers']
    }
  }
};

// Page-specific metadata templates
export const pageMetadata = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
    canonical: siteConfig.url
  },
  
  about: {
    title: "About Essaytude - AI Essay Writing Tutor",
    description: "Learn about Essaytude's mission to enhance academic writing through AI-powered analysis and feedback. Discover our features and commitment to educational excellence.",
    canonical: `${siteConfig.url}/about`
  },
  
  contact: {
    title: "Contact Essaytude - Get Writing Support",
    description: "Contact Essaytude for support, feedback, or questions about our AI essay writing tools. We're here to help improve your academic writing.",
    canonical: `${siteConfig.url}/contact`
  },
  
  privacy: {
    title: "Privacy Policy - Essaytude",
    description: "Essaytude's privacy policy explaining how we collect, use, and protect your personal information and essay data.",
    canonical: `${siteConfig.url}/privacy`
  },
  
  terms: {
    title: "Terms of Service - Essaytude",
    description: "Terms and conditions for using Essaytude's AI essay writing and analysis services.",
    canonical: `${siteConfig.url}/terms`
  },
  
  resources: {
    title: "Writing Resources & Guides - Essaytude",
    description: "Free writing resources, guides, and tips to improve your academic writing skills. Learn essay writing techniques and best practices.",
    canonical: `${siteConfig.url}/resources`
  }
};
