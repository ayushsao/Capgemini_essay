import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Essaytude',
  description: 'Read Essaytude\'s terms of service to understand the rules and guidelines for using our AI-powered essay writing assistance platform.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Essaytude
                </h1>
                <p className="text-xs text-gray-500 font-medium">Professional Essay Writing Tutor</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing and using Essaytude, you accept and agree to be bound by the terms and provision of this 
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Essaytude is an AI-powered essay writing assistance platform that provides analysis, feedback, and 
              improvement suggestions for academic writing. Our service is designed to help students enhance their 
              writing skills while maintaining academic integrity.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Academic Integrity</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use Essaytude responsibly and in accordance with academic integrity principles:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Use our service as a learning and improvement tool, not for academic dishonesty</li>
              <li>Ensure all submitted work represents your own ideas and efforts</li>
              <li>Follow your institution's academic integrity policies and guidelines</li>
              <li>Properly cite and attribute all sources used in your work</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Safeguarding your password and account information</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To submit harmful, offensive, or inappropriate content</li>
              <li>To transmit or create any viruses, worms, or destructive code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Content and Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              You retain ownership of all essays and content you submit to our platform. However, by using our service, 
              you grant us a limited license to process, analyze, and provide feedback on your content. We do not claim 
              ownership of your intellectual property.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Service Availability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We strive to maintain high service availability, but we do not guarantee uninterrupted access. We may 
              suspend or terminate services for maintenance, updates, or other operational reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Essaytude and its developers shall not be liable for any direct, indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our AI analysis and feedback are provided for educational purposes only. While we strive for accuracy, 
              we cannot guarantee the correctness of all suggestions. Users should exercise their own judgment and 
              consult with educators when needed.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the 
              service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may terminate or suspend your account and access to the service immediately, without prior notice, 
              for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to modify these terms at any time. We will notify users of any changes by posting 
              the new Terms of Service on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms shall be interpreted and governed by applicable laws. Any disputes shall be resolved through 
              appropriate legal channels.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@essaytude.com</p>
              <p className="text-gray-700 mb-2"><strong>Contact Page:</strong> <Link href="/contact" className="text-blue-600 hover:underline">essaytude.com/contact</Link></p>
              <p className="text-gray-700"><strong>Developer:</strong> Ayush Kumar Sao</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70">
            © 2025 <span className="font-bold text-yellow-300">Ayush Kumar Sao</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
