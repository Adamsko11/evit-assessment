import AssessmentForm from '@/components/AssessmentForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl text-gray-900">EVIT</span>
          </div>
          <a
            href="https://evit-org.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-600 transition"
          >
            evit-org.com
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            Free Assessment \u2014 Takes 5 Minutes
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Sales & Growth<br />
            <span className="text-blue-600">Readiness Assessment</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Understand your company&apos;s current sales foundation, market positioning, and growth capacity.
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            This assessment identifies strengths, gaps, and priority areas where EVIT Organization
            can help your team be well-prepared for sustainable business expansion into EU &amp; US markets.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Identify Gaps</h3>
            <p className="text-sm text-gray-600">
              Pinpoint exactly where your sales process needs strengthening for international markets.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Growth Roadmap</h3>
            <p className="text-sm text-gray-600">
              Get a personalized summary showing your readiness level and recommended next steps.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24h Review</h3>
            <p className="text-sm text-gray-600">
              Your answers reviewed within 24 hours to determine if global expansion makes sense now.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="assessment" className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
          <AssessmentForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 EVIT Organization. All rights reserved.</p>
          <p className="mt-1">Helping Asian IT companies break into EU &amp; US markets.</p>
        </div>
      </footer>
    </main>
  );
}
