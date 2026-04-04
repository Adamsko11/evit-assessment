'use client';

import { useState, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
}

interface AssessmentResult {
  overallScore: number;
  scoreLabel: string;
  dimensions: DimensionScore[];
  strengths: string[];
  problems: string[];
}

// ============================================================
// SCORING ENGINE
// ============================================================

function analyzeAssessment(answers: Record<string, any>): AssessmentResult {
  let salesFoundation = 0;
  let marketReadiness = 0;
  let growthCapacity = 0;
  let urgencyCommitment = 0;

  const strengths: string[] = [];
  const problems: string[] = [];

  // DIMENSION 1: SALES FOUNDATION (30 pts)
  // Sales Team (8 pts)
  if (answers.has_sales_team === 'More than 5') {
    salesFoundation += 8;
    strengths.push("You've built a real sales team — that's a major milestone most companies at your stage haven't reached.");
  } else if (answers.has_sales_team === '3-5 Salespeople') {
    salesFoundation += 6;
    strengths.push('You have a dedicated sales team in place — a strong foundation to scale from.');
  } else if (answers.has_sales_team === '1-2 Salespeople') {
    salesFoundation += 3;
  } else {
    problems.push(
      "No sales team means the founder is selling alone — and likely not selling enough. International expansion requires dedicated sales capacity you don't currently have."
    );
  }

  // ICP (8 pts)
  if (answers.has_icp === 'Yes') {
    salesFoundation += 8;
    strengths.push("You've defined your Ideal Customer Profile — you know exactly who you're going after.");
  } else {
    problems.push(
      "No defined ICP means you're targeting everyone and converting no one. Without knowing your ideal buyer in EU/US markets, every outreach is a shot in the dark."
    );
  }

  // USP (8 pts)
  if (answers.has_usp === 'Yes') {
    salesFoundation += 8;
    strengths.push('You have identified differentiators that set you apart — critical for standing out in crowded Western markets.');
  } else {
    problems.push(
      "Without a clear USP, you look like every other IT outsourcing company. EU/US buyers have hundreds of options — you need a compelling reason for them to choose you."
    );
  }

  // Service Offering (6 pts)
  if (answers.has_service_offering === 'Yes') {
    salesFoundation += 6;
  } else {
    problems.push(
      "No packaged service offering means prospects don't know what they're buying. International clients expect clear, structured proposals — not 'we can do anything.'"
    );
  }

  // DIMENSION 2: MARKET READINESS (25 pts)
  const channels = Array.isArray(answers.main_sales_channels) ? answers.main_sales_channels : [];
  const hasOutbound = channels.includes('Outbound (LinkedIn, cold email, calls)');
  const hasInbound = channels.includes('Inbound (ads, website, content)');
  const hasReferrals = channels.includes('Referrals / word of mouth');

  // Sales Channels Diversity (12 pts)
  if (channels.length >= 3) {
    marketReadiness += 12;
    strengths.push("You're running multiple sales channels — that's smart diversification that reduces risk.");
  } else if (channels.length === 2) {
    marketReadiness += 8;
  } else if (channels.length === 1) {
    marketReadiness += 4;
  }

  if (!hasOutbound && channels.length > 0) {
    problems.push(
      "You're not doing outbound prospecting. Referrals and inbound won't scale to EU/US — you need proactive LinkedIn outreach, cold email, and direct calls to decision-makers."
    );
  } else if (channels.length === 0) {
    problems.push(
      "No clear sales channels at all. You need at least 2-3 active channels to compete internationally, especially outbound."
    );
  }

  if (channels.length === 1 && hasReferrals) {
    problems.push(
      "Relying only on referrals is a growth ceiling. Referrals are unpredictable and don't scale — you need systematic, repeatable outreach."
    );
  }

  // Client Type Alignment (7 pts)
  if (answers.main_client_type === 'Large Enterprise') {
    marketReadiness += 7;
  } else if (answers.main_client_type === 'SMEs') {
    marketReadiness += 6;
  } else if (answers.main_client_type === 'Startups') {
    marketReadiness += 4;
  }

  // Annual Revenue Traction (6 pts)
  const revenueOptions = Array.isArray(answers.annual_revenue) ? answers.annual_revenue : [];
  const hasHighRevenue = revenueOptions.some((r: string) => r === '$1M - $5M' || r === '$5M+');
  const hasMidRevenue = revenueOptions.some((r: string) => r === '$500k - $1M');
  const hasLowRevenue = revenueOptions.some((r: string) => r === '$100k - $500k');

  if (hasHighRevenue) {
    marketReadiness += 6;
  } else if (hasMidRevenue) {
    marketReadiness += 5;
  } else if (hasLowRevenue) {
    marketReadiness += 3;
  }

  // DIMENSION 3: GROWTH CAPACITY (25 pts)
  // Company Size (10 pts)
  if (answers.company_size === '100+ Employees') {
    growthCapacity += 10;
  } else if (answers.company_size === '51-100 Employees') {
    growthCapacity += 8;
  } else if (answers.company_size === '11-50 Employees') {
    growthCapacity += 6;
  } else if (answers.company_size === '2-10 Employees') {
    growthCapacity += 3;
  }

  // Monthly Budget (10 pts)
  if (answers.monthly_budget === '$8k+') {
    growthCapacity += 10;
    strengths.push("You're investing seriously in growth — that budget shows real commitment to scaling.");
  } else if (answers.monthly_budget === '$3\u20138k') {
    growthCapacity += 7;
  } else if (answers.monthly_budget === '$1\u20133k') {
    growthCapacity += 3;
  } else if (answers.monthly_budget === '$0') {
    problems.push(
      "$0 sales & marketing budget is a dealbreaker for international expansion. Even $1-3k/month opens doors to systematic prospecting."
    );
  }

  // Revenue Scale (5 pts)
  if (hasHighRevenue) {
    growthCapacity += 5;
  } else if (hasMidRevenue) {
    growthCapacity += 4;
  } else if (hasLowRevenue) {
    growthCapacity += 2;
  }

  // DIMENSION 4: URGENCY & COMMITMENT (20 pts)
  // Urgency (10 pts)
  if (answers.urgency === 'Critical \u2013 we must act now') {
    urgencyCommitment += 10;
  } else if (answers.urgency === 'Urgent \u2013 we need to act in the next 3\u20136 months') {
    urgencyCommitment += 8;
  } else if (answers.urgency === 'Important, but not immediate') {
    urgencyCommitment += 4;
  }

  // Sales Function Commitment (6 pts)
  if (answers.tried_sales_function === 'Yes, and it worked') {
    urgencyCommitment += 6;
    strengths.push("You've already proven that structured sales works for you — now it's time to scale it internationally.");
  } else if (answers.tried_sales_function === "Yes, but it didn't work") {
    urgencyCommitment += 2;
    problems.push(
      "Your previous sales approach didn't deliver. That's actually valuable — it means you know what doesn't work. You need a strategy built specifically for international markets."
    );
  } else if (answers.tried_sales_function === 'No - not yet') {
    problems.push(
      "You haven't built a structured sales function yet. Without one, international expansion is just a wish, not a plan."
    );
  }

  // Budget Commitment (4 pts)
  if (answers.monthly_budget === '$8k+' || answers.monthly_budget === '$3\u20138k') {
    urgencyCommitment += 4;
  } else if (answers.monthly_budget === '$1\u20133k') {
    urgencyCommitment += 1;
  }

  // CALCULATE OVERALL
  const overallScore = Math.min(100, Math.round(salesFoundation + marketReadiness + growthCapacity + urgencyCommitment));

  let scoreLabel = '';
  if (overallScore >= 80) scoreLabel = 'Market Ready';
  else if (overallScore >= 60) scoreLabel = 'Growth Ready';
  else if (overallScore >= 40) scoreLabel = 'Building Foundation';
  else scoreLabel = 'Early Stage';

  // Fallback strengths
  if (strengths.length === 0) {
    if (answers.company_size && answers.company_size !== 'Solo Founder') {
      strengths.push("You have a team behind you — leverage them as you explore international growth.");
    }
    strengths.push("You're taking the first step by assessing your readiness — that puts you ahead of most.");
  }

  // Ensure minimum problems for urgency
  if (problems.length === 0) {
    problems.push("Even strong companies have blind spots in international markets. A strategy session can uncover opportunities you're missing.");
  }

  return {
    overallScore,
    scoreLabel,
    dimensions: [
      { name: 'Sales Foundation', score: salesFoundation, maxScore: 30 },
      { name: 'Market Readiness', score: marketReadiness, maxScore: 25 },
      { name: 'Growth Capacity', score: growthCapacity, maxScore: 25 },
      { name: 'Urgency & Commitment', score: urgencyCommitment, maxScore: 20 },
    ],
    strengths: strengths.slice(0, 4),
    problems: Array.from(new Set(problems)).slice(0, 5),
  };
}

// ============================================================
// ASSESSMENT RESULTS COMPONENT
// ============================================================

function AssessmentResults({ result }: { result: AssessmentResult }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [fadeInSections, setFadeInSections] = useState({
    gauge: false,
    dimensions: false,
    strengths: false,
    problems: false,
    cta: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showResults) return;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 2);
      setDisplayScore(Math.floor(result.overallScore * easeOut));
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayScore(result.overallScore);
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [showResults, result.overallScore]);

  useEffect(() => {
    if (!showResults) return;
    const timers = [
      setTimeout(() => setFadeInSections((p) => ({ ...p, gauge: true })), 0),
      setTimeout(() => setFadeInSections((p) => ({ ...p, dimensions: true })), 800),
      setTimeout(() => setFadeInSections((p) => ({ ...p, strengths: true })), 1600),
      setTimeout(() => setFadeInSections((p) => ({ ...p, problems: true })), 2400),
      setTimeout(() => setFadeInSections((p) => ({ ...p, cta: true })), 3200),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, [showResults]);

  const getScoreColor = (score: number) => {
    if (score <= 30) return { bg: 'bg-red-50', ring: 'stroke-red-500', text: 'text-red-600', label: 'text-red-500' };
    if (score <= 50) return { bg: 'bg-orange-50', ring: 'stroke-orange-500', text: 'text-orange-600', label: 'text-orange-500' };
    if (score <= 70) return { bg: 'bg-yellow-50', ring: 'stroke-yellow-500', text: 'text-yellow-600', label: 'text-yellow-500' };
    return { bg: 'bg-green-50', ring: 'stroke-green-500', text: 'text-green-600', label: 'text-green-500' };
  };

  const getDimBarColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct <= 30) return 'bg-red-500';
    if (pct <= 50) return 'bg-orange-500';
    if (pct <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const colors = getScoreColor(result.overallScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  if (isAnalyzing) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-8">
          <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Your Responses</h2>
        <p className="text-gray-500 mb-8">Evaluating your sales readiness across 4 key dimensions...</p>
        <div className="max-w-xs mx-auto">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-[3500ms] ease-out"
              style={{ width: isAnalyzing ? '90%' : '0%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Score Gauge */}
      <div className={`transition-all duration-1000 ${fadeInSections.gauge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className={`${colors.bg} rounded-2xl p-8 md:p-10 text-center mb-8 border border-gray-100`}>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Your Readiness Score</p>
          <div className="flex justify-center mb-6">
            <div className="relative w-44 h-44">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="45" fill="none" strokeWidth="8"
                  className={colors.ring}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${colors.text}`}>{displayScore}</span>
                <span className="text-sm text-gray-400 font-semibold">/ 100</span>
              </div>
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${colors.label} mb-1`}>{result.scoreLabel}</h2>
          <p className="text-gray-500 text-sm">
            {result.overallScore >= 80 && "Your foundation is strong — time to execute on international expansion."}
            {result.overallScore >= 60 && result.overallScore < 80 && "You have solid building blocks. A few strategic fixes will unlock major growth."}
            {result.overallScore >= 40 && result.overallScore < 60 && "You're building the right foundation, but critical gaps need addressing before scaling."}
            {result.overallScore < 40 && "You're in the early stages. Addressing these gaps now will set you up for sustainable growth."}
          </p>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className={`transition-all duration-1000 ${fadeInSections.dimensions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Readiness Breakdown</h3>
          <div className="space-y-5">
            {result.dimensions.map((dim, idx) => {
              const pct = Math.round((dim.score / dim.maxScore) * 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{dim.name}</span>
                    <span className="text-sm font-bold text-gray-500">{dim.score}/{dim.maxScore} <span className="text-xs text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getDimBarColor(dim.score, dim.maxScore)}`}
                      style={{ width: fadeInSections.dimensions ? `${pct}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className={`transition-all duration-1000 ${fadeInSections.strengths ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-5">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 mb-0.5" />
            What You're Doing Right
          </h3>
          <div className="space-y-4">
            {result.strengths.map((s, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problems */}
      <div className={`transition-all duration-1000 ${fadeInSections.problems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-400 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-5">
            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 mb-0.5" />
            Gaps Holding You Back
          </h3>
          <div className="space-y-4">
            {result.problems.map((p, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`transition-all duration-1000 ${fadeInSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Close These Gaps?</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Get a personalized action plan showing exactly how to fix these issues and unlock international growth.
          </p>
          <a
            href="https://meetings-na2.hubspot.com/adam-skoneczny"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Book Your Free Strategy Call
          </a>
          <p className="text-blue-200 text-sm mt-4">30 minutes, no commitment, no sales pitch</p>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8 mb-4">
        Your responses are confidential. Results generated specifically for your situation.
      </p>
    </div>
  );
}

// ============================================================
// ASSESSMENT STEPS (same as original)
// ============================================================

const steps = [
  {
    title: 'About You & Your Company',
    description: "Let's start with some basic information about you and your organization.",
    fields: [
      { id: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
      { id: 'linkedin_profile', label: 'LinkedIn Profile', type: 'text', required: false, placeholder: 'https://linkedin.com/in/yourprofile' },
      { id: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. CEO, CTO, Founder' },
      { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { id: 'organization', label: 'Organization', type: 'text', required: true, placeholder: 'Your company name' },
      { id: 'company_size', label: '1. Company Size', type: 'radio', required: true, options: ['Solo Founder', '2-10 Employees', '11-50 Employees', '51-100 Employees', '100+ Employees'] },
      { id: 'annual_revenue', label: '2. Annual Revenue', type: 'checkbox', required: true, options: ['<$100k', '$100k - $500k', '$500k - $1M', '$1M - $5M', '$5M+'] },
      { id: 'main_client_type', label: '3. Main Client Type', type: 'radio', required: true, options: ['Startups', 'SMEs', 'Large Enterprise', 'Other'] },
    ],
  },
  {
    title: 'Current Sales Situation',
    description: 'Help us understand your current sales foundation and capabilities.',
    fields: [
      { id: 'has_sales_team', label: '4. Do you currently have a sales team? (Account Manager / Business Development / Sales)', type: 'radio', required: true, options: ['No', '1-2 Salespeople', '3-5 Salespeople', 'More than 5'] },
      { id: 'main_sales_channels', label: '5. What are your main sales channels today?', type: 'checkbox', required: true, options: ['Referrals / word of mouth', 'Inbound (ads, website, content)', 'Outbound (LinkedIn, cold email, calls)', 'Partnerships / networks', 'Other'] },
      { id: 'has_icp', label: '6. Do you have a defined Ideal Customer Profile (ICP) for your target market?', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'has_usp', label: '7. Have you clearly identified your unique differentiators in global markets (USP)?', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'icp_description', label: 'If yes, please describe briefly your Ideal Customer Profile (ICP):', type: 'textarea', required: false, placeholder: 'Describe your ideal customer...' },
      { id: 'has_service_offering', label: '8. Have you defined a clear service offering tailored to international clients?', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'service_offering_description', label: 'If yes, please describe briefly your service offering:', type: 'textarea', required: false, placeholder: 'Describe your service offering...' },
    ],
  },
  {
    title: 'Challenges & Needs',
    description: "Tell us about the obstacles you're facing and what you need most.",
    fields: [
      { id: 'biggest_challenge', label: "10. What's your biggest challenge in winning new clients right now?", type: 'textarea', required: true, placeholder: 'Describe your biggest challenge...' },
      { id: 'tried_sales_function', label: '11. Have you tried building a sales function in the past?', type: 'radio', required: true, options: ["Yes, but it didn't work", 'Yes, and it worked', 'No - not yet'] },
      { id: 'one_thing_to_change', label: '12. If you could change one thing about how you get clients and it would have the biggest positive impact on your business — what would it be?', type: 'textarea', required: true, placeholder: 'What one change would have the biggest impact?' },
    ],
  },
  {
    title: 'Readiness & Urgency',
    description: 'Help us understand your timeline and investment capacity.',
    fields: [
      { id: 'monthly_budget', label: '13. What is your current monthly budget for sales and marketing?', type: 'radio', required: true, options: ['$0', '$1\u20133k', '$3\u20138k', '$8k+'] },
      { id: 'urgency', label: '14. How urgent is scaling your sales right now?', type: 'radio', required: true, options: ['Not urgent \u2013 exploring options', 'Important, but not immediate', 'Urgent \u2013 we need to act in the next 3\u20136 months', 'Critical \u2013 we must act now'] },
    ],
  },
  {
    title: 'Almost Done!',
    description: '\uD83D\uDC49 Your answers will be reviewed within 24 hours to determine whether global expansion makes sense now, later, or not at all.',
    fields: [
      { id: 'preferred_contact', label: 'Please let us know your preferred way to receive a summary', type: 'radio', required: true, options: ['Email', '1 on 1 online call', 'LinkedIn Message (please make sure you provided LinkedIn URL)'] },
    ],
  },
];

// ============================================================
// MAIN ASSESSMENT COMPONENT
// ============================================================

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function updateAnswer(id: string, value: any) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  function toggleCheckbox(fieldId: string, option: string, checked: boolean) {
    const current = answers[fieldId] || [];
    updateAnswer(fieldId, checked ? [...current, option] : current.filter((o: string) => o !== option));
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of step.fields) {
      if (field.required) {
        const val = answers[field.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.id] = 'This field is required';
        }
      }
      if (field.type === 'email' && answers[field.id]) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers[field.id])) {
          newErrors[field.id] = 'Please enter a valid email';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (validateStep()) {
      setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      // Flatten answers for API submission
      const payload: Record<string, string> = {};
      for (const [key, val] of Object.entries(answers)) {
        payload[key] = Array.isArray(val) ? val.join(', ') : val;
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }

      // Run scoring engine
      const result = analyzeAssessment(answers);
      setAssessmentResult(result);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // RESULTS SCREEN
  if (isSubmitted && assessmentResult) {
    return <AssessmentResults result={assessmentResult} />;
  }

  // FORM SCREEN
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
        {step.description && <p className="text-gray-600">{step.description}</p>}
      </div>

      {/* Fields */}
      <div>
        {step.fields.map((field) => {
          const error = errors[field.id];

          if (field.type === 'text' || field.type === 'email') {
            return (
              <div key={field.id} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  value={answers[field.id] || ''}
                  onChange={(e) => updateAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400`}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.id} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={answers[field.id] || ''}
                  onChange={(e) => updateAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 resize-none`}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            );
          }

          if (field.type === 'radio') {
            return (
              <div key={field.id} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${answers[field.id] === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        checked={answers[field.id] === option}
                        onChange={() => updateAnswer(field.id, option)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            );
          }

          if (field.type === 'checkbox') {
            const selected = answers[field.id] || [];
            return (
              <div key={field.id} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                  <span className="font-normal text-gray-500 text-xs ml-2">(select all that apply)</span>
                </label>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${selected.includes(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={(e) => toggleCheckbox(field.id, option, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-medium transition ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          &larr; Back
        </button>
        {currentStep < totalSteps - 1 ? (
          <button onClick={goNext} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
            Next &rarr;
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Get My Results'}
          </button>
        )}
      </div>
    </div>
  );
}
