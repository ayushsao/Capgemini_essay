import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Writing Resources - Essaytude',
  description: 'Discover comprehensive writing guides, tips, and resources to improve your academic writing skills. Expert advice for students at all levels.',
  keywords: 'writing tips, essay guides, academic writing, writing resources, student help',
};

const writingTips = [
  {
    id: 1,
    title: "How to Write a Strong Thesis Statement",
    excerpt: "Learn the fundamentals of crafting compelling thesis statements that anchor your academic essays.",
    category: "Essay Basics",
    readTime: "5 min read",
    date: "2025-01-15",
    content: `
      A strong thesis statement is the backbone of any successful essay. It serves as a roadmap for your readers and keeps your writing focused.
      
      ## Key Elements of a Strong Thesis Statement:
      
      1. **Specificity**: Your thesis should be specific enough to be argued effectively within the scope of your essay.
      2. **Arguability**: It should present a claim that reasonable people could disagree with.
      3. **Evidence-based**: Your thesis should be supportable with evidence from your research.
      
      ## Examples:
      
      **Weak**: "Social media is bad for teenagers."
      **Strong**: "Excessive social media use among teenagers leads to decreased academic performance and increased anxiety levels, making digital literacy education essential in modern curricula."
      
      ## Tips for Writing:
      
      - Start with a question and develop your answer into a thesis
      - Revise your thesis as your essay evolves
      - Place your thesis at the end of your introduction
      - Make sure it previews the main points of your essay
    `
  },
  {
    id: 2,
    title: "Avoiding Plagiarism: A Complete Guide",
    excerpt: "Understand what plagiarism is and learn effective strategies to maintain academic integrity in your writing.",
    category: "Academic Integrity",
    readTime: "7 min read",
    date: "2025-01-12",
    content: `
      Plagiarism is the use of someone else's words, ideas, or work without proper attribution. It's one of the most serious academic offenses.
      
      ## Types of Plagiarism:
      
      1. **Direct Plagiarism**: Copying text word-for-word without quotation marks or citation
      2. **Self-Plagiarism**: Reusing your own previous work without disclosure
      3. **Mosaic Plagiarism**: Mixing copied phrases with your own words
      4. **Accidental Plagiarism**: Unintentional failure to cite sources properly
      
      ## Prevention Strategies:
      
      - Always cite your sources using the appropriate citation style
      - Use quotation marks for direct quotes
      - Paraphrase properly by completely rewording ideas
      - Keep detailed notes during research to track sources
      - Use plagiarism detection tools to check your work
      
      ## Citation Best Practices:
      
      - Learn your required citation style (APA, MLA, Chicago, etc.)
      - Cite both direct quotes and paraphrased ideas
      - Include a complete bibliography or works cited page
      - When in doubt, cite the source
    `
  },
  {
    id: 3,
    title: "Effective Essay Structure and Organization",
    excerpt: "Master the art of organizing your essays for maximum clarity and impact using proven structural frameworks.",
    category: "Essay Structure",
    readTime: "6 min read",
    date: "2025-01-10",
    content: `
      A well-organized essay guides readers through your argument logically and persuasively.
      
      ## The Five-Paragraph Essay Structure:
      
      ### Introduction (1 paragraph)
      - Hook to grab attention
      - Background context
      - Thesis statement
      
      ### Body Paragraphs (3 paragraphs)
      - Topic sentence
      - Evidence and examples
      - Analysis and explanation
      - Transition to next point
      
      ### Conclusion (1 paragraph)
      - Restate thesis
      - Summarize main points
      - Broader implications
      
      ## Advanced Structures:
      
      ### Compare and Contrast
      - Point-by-point method
      - Block method
      - Mixed method
      
      ### Argumentative Essays
      - Classical structure
      - Rogerian structure
      - Toulmin method
      
      ## Organization Tips:
      
      - Create an outline before writing
      - Use transitional phrases between paragraphs
      - Ensure each paragraph supports your thesis
      - Maintain logical flow throughout
    `
  },
  {
    id: 4,
    title: "Research Strategies for Academic Writing",
    excerpt: "Discover effective research methods and source evaluation techniques for academic excellence.",
    category: "Research Skills",
    readTime: "8 min read",
    date: "2025-01-08",
    content: `
      Effective research is the foundation of strong academic writing. Quality sources strengthen your arguments and credibility.
      
      ## Research Process:
      
      1. **Define Your Research Question**
         - Be specific and focused
         - Consider scope and feasibility
         - Align with assignment requirements
      
      2. **Source Types**
         - Primary sources (original research, documents)
         - Secondary sources (analysis, interpretation)
         - Tertiary sources (encyclopedias, textbooks)
      
      3. **Source Evaluation Criteria**
         - **Authority**: Who wrote it? What are their credentials?
         - **Accuracy**: Is the information reliable and fact-checked?
         - **Currency**: How recent is the information?
         - **Relevance**: Does it directly relate to your topic?
         - **Purpose**: What is the author's intent?
      
      ## Research Strategies:
      
      - Start with general sources for background
      - Use academic databases for scholarly articles
      - Follow citation trails from good sources
      - Take detailed notes with source information
      - Organize sources by theme or argument
      
      ## Database Resources:
      
      - Google Scholar for academic papers
      - JSTOR for humanities and social sciences
      - PubMed for medical and life sciences
      - Library databases for peer-reviewed sources
    `
  },
  {
    id: 5,
    title: "Grammar and Style Essentials",
    excerpt: "Polish your writing with essential grammar rules and style guidelines for academic success.",
    category: "Grammar & Style",
    readTime: "10 min read",
    date: "2025-01-05",
    content: `
      Strong grammar and style are essential for clear, professional academic writing.
      
      ## Common Grammar Issues:
      
      ### Subject-Verb Agreement
      - Singular subjects take singular verbs
      - Plural subjects take plural verbs
      - Watch for collective nouns and indefinite pronouns
      
      ### Comma Usage
      - Oxford comma in series
      - Before coordinating conjunctions in compound sentences
      - After introductory elements
      - Around non-essential clauses
      
      ### Apostrophe Rules
      - Possession: student's book, students' books
      - Contractions: don't, won't, it's
      - Never use for plurals
      
      ## Style Guidelines:
      
      ### Clarity and Concision
      - Eliminate unnecessary words
      - Use active voice when possible
      - Choose specific, concrete words
      - Vary sentence structure
      
      ### Academic Tone
      - Avoid informal language
      - Use third person perspective
      - Be objective and evidence-based
      - Maintain professional language
      
      ## Revision Strategies:
      
      - Read your work aloud
      - Check for one type of error at a time
      - Use grammar checking tools
      - Get feedback from others
      - Allow time between writing and revising
    `
  }
];

export default function ResourcesPage() {
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
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Home
              </Link>
              <Link href="/resources" className="text-blue-600 font-medium">
                Resources
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Writing Resources & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Enhance your academic writing skills with our comprehensive collection of guides, tips, and best practices.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All", "Essay Basics", "Academic Integrity", "Essay Structure", "Research Skills", "Grammar & Style"].map((category) => (
            <button
              key={category}
              className="px-6 py-2 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Writing Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {writingTips.map((tip) => (
            <article key={tip.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {tip.category}
                  </span>
                  <span className="text-sm text-gray-500">{tip.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {tip.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {tip.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{new Date(tip.date).toLocaleDateString()}</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Additional Resources */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Additional Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Writing Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Download ready-to-use essay templates and outlines for different types of academic writing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Checklists</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our comprehensive checklists to ensure your essays meet all academic standards and requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Tips</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant writing tips and reminders to improve your essays with actionable advice.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Writing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Put these tips into practice with our AI-powered essay analysis tool.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 shadow-lg"
            >
              Start Writing Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Essaytude</h3>
                  <p className="text-white/70 text-sm">Professional Essay Writing Tutor</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Empowering students with AI-powered writing assistance and comprehensive academic resources.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/resources" className="hover:text-white transition-colors">Writing Guides</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Checklists</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/70">
              © 2025 <span className="font-bold text-yellow-300">Ayush Kumar Sao</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
