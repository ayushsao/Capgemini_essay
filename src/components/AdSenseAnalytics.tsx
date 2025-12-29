'use client';

import React, { useState, useEffect } from 'react';

// CSS for hiding scrollbar on tab navigation
const scrollbarStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

interface PerformanceMetrics {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  mobileTraffic: number;
  desktopTraffic: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface AdSenseCompliance {
  contentQuality: boolean;
  navigation: boolean;
  aboutPage: boolean;
  contactPage: boolean;
  privacyPolicy: boolean;
  termsOfService: boolean;
  originalContent: boolean;
  mobileOptimized: boolean;
  fastLoading: boolean;
  userExperience: boolean;
}

export default function AdSenseAnalytics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    mobileTraffic: 0,
    desktopTraffic: 0,
    coreWebVitals: { lcp: 0, fid: 0, cls: 0 }
  });

  const [compliance, setCompliance] = useState<AdSenseCompliance>({
    contentQuality: true,
    navigation: true,
    aboutPage: true,
    contactPage: true,
    privacyPolicy: true,
    termsOfService: true,
    originalContent: true,
    mobileOptimized: true,
    fastLoading: true,
    userExperience: true
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analytics data
      setMetrics({
        pageViews: 12847,
        uniqueVisitors: 8934,
        avgSessionDuration: 245, // seconds
        bounceRate: 32.5, // percentage
        mobileTraffic: 68.3, // percentage
        desktopTraffic: 31.7, // percentage
        coreWebVitals: {
          lcp: 1.8, // seconds
          fid: 45, // milliseconds
          cls: 0.05 // score
        }
      });
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, []);

  const complianceScore = Object.values(compliance).filter(Boolean).length / Object.values(compliance).length * 100;

  const getWebVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const MetricCard = ({ title, value, trend, icon }: { title: string; value: string; trend: string; icon: string }) => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</h3>
        <span className="text-lg sm:text-2xl flex-shrink-0">{icon}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{value}</div>
      <div className="text-xs text-green-600">{trend}</div>
    </div>
  );

  const ComplianceItem = ({ name, status }: { name: string; status: boolean }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
        <span className={`text-lg sm:text-xl flex-shrink-0 ${status ? 'text-green-500' : 'text-red-500'}`}>
          {status ? '✅' : '❌'}
        </span>
        <span className="text-xs sm:text-sm font-medium capitalize truncate">
          {name.replace(/([A-Z])/g, ' $1').trim()}
        </span>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
        status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status ? 'OK' : 'Fix'}
      </span>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AdSense Analytics</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Monitor your website performance and compliance</p>
          </div>
          <div className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${
            complianceScore === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {complianceScore.toFixed(0)}% Compliant
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-white p-1 rounded-lg shadow mb-4 sm:mb-6 scrollbar-hide">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'performance', name: 'Performance', icon: '⚡' },
            { id: 'compliance', name: 'Compliance', icon: '✅' },
            { id: 'optimization', name: 'Optimization', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors min-w-fit ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <MetricCard
                title="Page Views"
                value={isLoading ? '...' : metrics.pageViews.toLocaleString()}
                trend="+12.5% from last month"
                icon="👁️"
              />
              <MetricCard
                title="Unique Visitors"
                value={isLoading ? '...' : metrics.uniqueVisitors.toLocaleString()}
                trend="+8.3% from last month"
                icon="👥"
              />
              <MetricCard
                title="Avg. Session"
                value={isLoading ? '...' : formatDuration(metrics.avgSessionDuration)}
                trend="+15.2% from last month"
                icon="⏱️"
              />
              <MetricCard
                title="Bounce Rate"
                value={isLoading ? '...' : `${metrics.bounceRate}%`}
                trend="-5.1% from last month"
                icon="📈"
              />
            </div>

            {/* Traffic Sources & Core Web Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Traffic Sources</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-sm sm:text-base">📱</span>
                      <span className="font-medium text-sm sm:text-base">Mobile</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${metrics.mobileTraffic}%`}}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm min-w-[3rem] text-right">{metrics.mobileTraffic}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-sm sm:text-base">🖥️</span>
                      <span className="font-medium text-sm sm:text-base">Desktop</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${metrics.desktopTraffic}%`}}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm min-w-[3rem] text-right">{metrics.desktopTraffic}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Core Web Vitals</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm truncate pr-2">LCP (Largest Contentful Paint)</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      getWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {metrics.coreWebVitals.lcp}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm truncate pr-2">FID (First Input Delay)</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      getWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {metrics.coreWebVitals.fid}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm truncate pr-2">CLS (Cumulative Layout Shift)</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                      getWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {metrics.coreWebVitals.cls}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">AdSense Compliance Checklist</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Ensure your website meets all AdSense requirements for approval</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {Object.entries(compliance).map(([key, value]) => (
                  <ComplianceItem key={key} name={key} status={value} />
                ))}
              </div>
              
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                  Compliance Score: {complianceScore.toFixed(0)}%
                </h4>
                <p className="text-blue-800 text-xs sm:text-sm">
                  {complianceScore === 100 
                    ? "Excellent! Your website meets all AdSense requirements. Keep maintaining these standards for optimal ad performance."
                    : "Your website meets most AdSense requirements. Review the items marked as 'Needs Fix' to improve your compliance score."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Optimization Recommendations</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Improve your AdSense performance with these suggestions</p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-900 text-sm sm:text-base">✅ Excellent Performance</h4>
                  <p className="text-green-800 text-xs sm:text-sm mt-1">
                    Your Core Web Vitals are within the good range. Keep monitoring to maintain this performance.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 text-sm sm:text-base">💡 Content Optimization</h4>
                  <ul className="text-blue-800 text-xs sm:text-sm mt-1 space-y-1">
                    <li>• Add more diverse content types (videos, infographics)</li>
                    <li>• Increase content length for better engagement</li>
                    <li>• Update content regularly to maintain freshness</li>
                    <li>• Create pillar pages and topic clusters</li>
                  </ul>
                </div>
                
                <div className="p-3 sm:p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-900 text-sm sm:text-base">⚡ Performance Tips</h4>
                  <ul className="text-yellow-800 text-xs sm:text-sm mt-1 space-y-1">
                    <li>• Implement image lazy loading</li>
                    <li>• Minify CSS and JavaScript files</li>
                    <li>• Use a Content Delivery Network (CDN)</li>
                    <li>• Optimize image formats (WebP, AVIF)</li>
                  </ul>
                </div>
                
                <div className="p-3 sm:p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-semibold text-purple-900 text-sm sm:text-base">🎯 AdSense Optimization</h4>
                  <ul className="text-purple-800 text-xs sm:text-sm mt-1 space-y-1">
                    <li>• Experiment with different ad placements</li>
                    <li>• Use responsive ad units for better mobile experience</li>
                    <li>• Monitor ad performance and optimize accordingly</li>
                    <li>• Implement Auto ads for optimal placement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Performance Monitoring</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Track your website's performance metrics over time</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Performance Timeline</h4>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Connect Google Analytics for detailed performance insights and historical data
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-semibold text-sm sm:text-base">Quick Performance Tests</h4>
                  <div className="space-y-2">
                    <button className="w-full p-2 sm:p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-sm sm:text-base">🚀</span>
                        <span className="font-medium text-sm sm:text-base">Run Speed Test</span>
                      </div>
                    </button>
                    <button className="w-full p-2 sm:p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-sm sm:text-base">🎯</span>
                        <span className="font-medium text-sm sm:text-base">Check SEO Score</span>
                      </div>
                    </button>
                    <button className="w-full p-2 sm:p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-sm sm:text-base">🌐</span>
                        <span className="font-medium text-sm sm:text-base">Validate HTML</span>
                      </div>
                    </button>
                    <button className="w-full p-2 sm:p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-sm sm:text-base">📱</span>
                        <span className="font-medium text-sm sm:text-base">Test Mobile Usability</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
