// React hooks for performance monitoring
// Helps meet AdSense requirement for fast-loading pages

import { useEffect } from 'react';
import { PerformanceMonitor } from '../utils/performance';

// Hook for tracking page performance
export const usePerformanceTracking = (pageName: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const monitor = PerformanceMonitor.getInstance();
      
      // Track page load performance
      monitor.trackPageLoad(pageName);
      
      // Track Core Web Vitals
      monitor.getCoreWebVitals().then(vitals => {
        console.log(`Core Web Vitals for ${pageName}:`, vitals);
      });
    }
  }, [pageName]);
};

// Hook for lazy loading images
export const useLazyLoading = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      PerformanceMonitor.optimizeImages();
    }
  }, []);
};

// Hook for initializing performance optimizations
export const usePerformanceOptimizations = () => {
  useEffect(() => {
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
  }, []);
};

export default { usePerformanceTracking, useLazyLoading, usePerformanceOptimizations };
