import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Essaytude',
  description: 'Learn how Essaytude protects your privacy and handles your personal data. Our comprehensive privacy policy ensures transparency and data security.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At Essaytude, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website and use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Register for an account</li>
              <li>Use our essay analysis services</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or feedback forms</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may automatically collect certain information about your device and usage patterns, including:
              IP address, browser type, operating system, access times, and pages viewed.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Processing and analyzing your essays</li>
              <li>Improving our AI algorithms and user experience</li>
              <li>Communicating with you about our services</li>
              <li>Providing customer support</li>
              <li>Detecting and preventing fraud or security issues</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
              the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Essay Content and Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your essay content is treated with the highest level of confidentiality. We do not share, sell, or use your 
              essays for any purpose other than providing you with analysis and feedback. Your intellectual property remains 
              yours at all times.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can choose to 
              disable cookies through your browser settings, though this may affect some functionality of our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may use third-party services for analytics, payment processing, and other functionalities. These services 
              have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@essaytude.com</p>
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
