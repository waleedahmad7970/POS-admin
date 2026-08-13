import React, { useState, useEffect } from 'react';
import StatCards from './StatCards';
import RevenueChart from './RevenueChart';
import axiosClient from '../../api/axiosClient';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosClient.get('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }
  return (
    <div>
      <StatCards transactions={transactions} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart transactions={transactions} />
        {/* Placeholder for Recent Activity or Top Products */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-text mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx._id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-sm">Receipt #{tx.receiptNumber}</p>
                  <p className="text-xs text-secondary">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <span className="font-bold text-primary">${tx.totals?.grandTotal?.toFixed(2) || '0.00'}</span>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-muted text-sm">No recent transactions</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
