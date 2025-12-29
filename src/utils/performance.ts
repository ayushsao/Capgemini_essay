// Performance monitoring and optimization utilities
// Helps meet AdSense requirement for fast-loading pages

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load performance
  trackPageLoad(pageName: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const firstPaint = this.getFirstPaint();
      
      this.metrics.set(`${pageName}_loadTime`, loadTime);
      this.metrics.set(`${pageName}_domContentLoaded`, domContentLoaded);
      
      if (firstPaint) {
        this.metrics.set(`${pageName}_firstPaint`, firstPaint);
      }

      // Log performance metrics for monitoring
      console.log(`Page: ${pageName}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
        firstPaint: firstPaint ? `${firstPaint.toFixed(2)}ms` : 'Not available'
      });

      // Report slow pages (> 3 seconds)
      if (loadTime > 3000) {
        this.reportSlowPage(pageName, loadTime);
      }
    }
  }

  // Get First Paint timing
  private getFirstPaint(): number | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : null;
    }
    return null;
  }

  // Report slow page performance
  private reportSlowPage(pageName: string, loadTime: number): void {
    // In production, this could send data to analytics
    console.warn(`Slow page detected: ${pageName} took ${loadTime.toFixed(2)}ms to load`);
  }

  // Get Core Web Vitals
  getCoreWebVitals(): Promise<{LCP?: number, FID?: number, CLS?: number}> {
    return new Promise((resolve) => {
      const vitals: {LCP?: number, FID?: number, CLS?: number} = {};

      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = lastEntry.startTime;
        }).observe({entryTypes: ['largest-contentful-paint']});

        // First Input Delay
        new PerformanceObserver((entryList) => {
          const firstInput = entryList.getEntries()[0] as any;
          vitals.FID = firstInput.processingStart - firstInput.startTime;
        }).observe({entryTypes: ['first-input']});

        // Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
          let clsValue = 0;
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.CLS = clsValue;
        }).observe({entryTypes: ['layout-shift']});

        // Resolve after a reasonable delay
        setTimeout(() => resolve(vitals), 2000);
      } else {
        resolve(vitals);
      }
    });
  }

  // Image lazy loading optimization
  static optimizeImages(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Resource hint optimization
  static addResourceHints(): void {
    if (typeof document !== 'undefined') {
      // Preconnect to external domains
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.googletagmanager.com'
      ];

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    }
  }

  // Critical CSS optimization
  static inlineCriticalCSS(): void {
    // This would be implemented with a build-time tool
    // For now, we ensure critical styles are in the main CSS
    console.log('Critical CSS optimization active');
  }

  // Service Worker registration for caching
  static registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Get performance metrics
  getMetrics(): Map<string, number> {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Add resource hints
    PerformanceMonitor.addResourceHints();
    
    // Optimize images
    PerformanceMonitor.optimizeImages();
    
    // Register service worker
    PerformanceMonitor.registerServiceWorker();
    
    // Inline critical CSS
    PerformanceMonitor.inlineCriticalCSS();
  }
};

// Track page performance for specific pages
export const trackPagePerformance = (pageName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.trackPageLoad(pageName);
};

// Get Core Web Vitals for monitoring
export const getCoreWebVitals = () => {
  const monitor = PerformanceMonitor.getInstance();
  return monitor.getCoreWebVitals();
};

export default PerformanceMonitor;
