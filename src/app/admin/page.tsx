'use client';

import { useState, useEffect, useCallback } from 'react';

interface Submission {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  organization: string;
  title: string;
  linkedin_profile: string;
  company_size: string;
  annual_revenue: string;
  main_client_type: string;
  has_sales_team: string;
  main_sales_channels: string;
  has_icp: string;
  has_usp: string;
  icp_description: string;
  has_service_offering: string;
  service_offering_description: string;
  biggest_challenge: string;
  tried_sales_function: string;
  one_thing_to_change: string;
  monthly_budget: string;
  urgency: string;
  preferred_contact: string;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  byUrgency: { urgency: string; count: string }[];
  bySize: { company_size: string; count: string }[];
  byBudget: { monthly_budget: string; count: string }[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions'>('dashboard');
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const fetchSubmissions = useCallback(async (page = 1) => {
    const res = await fetch(`/api/submissions?page=${page}&limit=15`);
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
          fetchSubmissions();
          fetchStats();
        }
      })
      .finally(() => setIsLoading(false));
  }, [fetchSubmissions, fetchStats]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setIsFirstLogin(true);
        fetchSubmissions();
        fetchStats();
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Connection error');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
  }

  async function handleExport() {
    window.location.href = '/api/admin/export';
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">EVIT Assessment Dashboard</p>
            <p className="text-blue-600 text-xs mt-2 bg-blue-50 rounded-lg p-2">
              First login will create your admin account
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const urgencyColors: Record<string, string> = {
    'Critical – we must act now': 'bg-red-100 text-red-800',
    'Urgent – we need to act in the next 3–6 months': 'bg-orange-100 text-orange-800',
    'Important, but not immediate': 'bg-yellow-100 text-yellow-800',
    'Not urgent – exploring options': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-gray-900">EVIT Admin</span>
            </div>
            <nav className="flex gap-1 ml-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'submissions' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Submissions
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
              Export CSV
            </button>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      {isFirstLogin && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-800 text-sm">Admin account created successfully! Remember your credentials.</p>
            <button onClick={() => setIsFirstLogin(false)} className="text-green-600 hover:text-green-800">✕</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Today</p>
                <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">This Week</p>
                <p className="text-3xl font-bold text-green-600">{stats.thisWeek}</p>
              </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">By Urgency</h3>
                {stats.byUrgency.map(item => (
                  <div key={item.urgency} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${urgencyColors[item.urgency] || 'bg-gray-100 text-gray-800'}`}>
                      {item.urgency?.split('–')[0]?.trim() || 'Unknown'}
                    </span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">By Company Size</h3>
                {stats.bySize.map(item => (
                  <div key={item.company_size} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{item.company_size}</span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">By Budget</h3>
                {stats.byBudget.map(item => (
                  <div key={item.monthly_budget} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{item.monthly_budget}</span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'submissions' && (
          <>
            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Organization</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Size</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Budget</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Urgency</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSubmission(s)}>
                        <td className="px-4 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.full_name}</td>
                        <td className="px-4 py-3 text-gray-700">{s.organization}</td>
                        <td className="px-4 py-3 text-gray-600">{s.company_size}</td>
                        <td className="px-4 py-3 text-gray-600">{s.monthly_budget}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${urgencyColors[s.urgency] || 'bg-gray-100'}`}>
                            {s.urgency?.split('–')[0]?.trim()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</button>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No submissions yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => fetchSubmissions(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => fetchSubmissions(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{selectedSubmission.full_name}</h2>
              <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Email', value: selectedSubmission.email },
                { label: 'Title', value: selectedSubmission.title },
                { label: 'Organization', value: selectedSubmission.organization },
                { label: 'LinkedIn', value: selectedSubmission.linkedin_profile, isLink: true },
                { label: 'Company Size', value: selectedSubmission.company_size },
                { label: 'Annual Revenue', value: selectedSubmission.annual_revenue },
                { label: 'Main Client Type', value: selectedSubmission.main_client_type },
                { label: 'Sales Team', value: selectedSubmission.has_sales_team },
                { label: 'Sales Channels', value: selectedSubmission.main_sales_channels },
                { label: 'Has ICP', value: selectedSubmission.has_icp },
                { label: 'Has USP', value: selectedSubmission.has_usp },
                { label: 'ICP Description', value: selectedSubmission.icp_description },
                { label: 'Service Offering Defined', value: selectedSubmission.has_service_offering },
                { label: 'Service Offering', value: selectedSubmission.service_offering_description },
                { label: 'Biggest Challenge', value: selectedSubmission.biggest_challenge },
                { label: 'Tried Sales Function', value: selectedSubmission.tried_sales_function },
                { label: 'One Thing to Change', value: selectedSubmission.one_thing_to_change },
                { label: 'Monthly Budget', value: selectedSubmission.monthly_budget },
                { label: 'Urgency', value: selectedSubmission.urgency },
                { label: 'Preferred Contact', value: selectedSubmission.preferred_contact },
                { label: 'Submitted', value: new Date(selectedSubmission.created_at).toLocaleString() },
              ].map(({ label, value, isLink }) => (
                value ? (
                  <div key={label} className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500">{label}</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {isLink ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{value}</a> : value}
                    </span>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
