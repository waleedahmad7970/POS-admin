import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Calculator, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TillReports() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/till-sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch till sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.openedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-secondary">Loading Till Reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text">Till Reports</h1>
          <p className="text-secondary mt-1">Review historical cash register sessions and discrepancies.</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Cashier or Session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-text">Date / Session</th>
              <th className="px-6 py-4 text-sm font-semibold text-text">Cashier</th>
              <th className="px-6 py-4 text-sm font-semibold text-text text-right">Float</th>
              <th className="px-6 py-4 text-sm font-semibold text-text text-right">Sales + Added</th>
              <th className="px-6 py-4 text-sm font-semibold text-text text-right">Drop</th>
              <th className="px-6 py-4 text-sm font-semibold text-text text-right">Expected / Actual</th>
              <th className="px-6 py-4 text-sm font-semibold text-text text-right">Discrepancy</th>
              <th className="px-6 py-4 text-sm font-semibold text-text">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-text">{new Date(session.openedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-secondary mt-0.5">{session.sessionId}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {session.openedBy?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-text">{session.openedBy?.name || 'Unknown'}</p>
                      <p className="text-xs text-secondary">ID: {session.openedBy?.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-text">
                  ${session.startingFloat.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-green-600 font-medium">
                    +${(session.expectedCash - session.startingFloat + session.cashDrop).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-500 font-medium">
                    -${(session.cashDrop || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-gray-500">${session.expectedCash.toFixed(2)}</p>
                  {session.status === 'Closed' && (
                    <p className="font-bold text-text">${session.actualCash.toFixed(2)}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {session.status === 'Closed' ? (
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-sm font-medium ${
                      session.discrepancy === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {session.discrepancy === 0 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      <span>{session.discrepancy > 0 ? '+' : ''}{session.discrepancy.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    session.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {session.status}
                  </span>
                  {session.notes && (
                    <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={session.notes}>
                      {session.notes}
                    </p>
                  )}
                </td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-secondary">
                  No till sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
