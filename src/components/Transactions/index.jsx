import React, { useState, useEffect } from 'react';
import { Eye, Printer, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Transactions() {
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
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text">Transaction Audit Log</h2>
        {/* Could add date filters here */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-secondary">
              <th className="pb-3 font-semibold">Receipt #</th>
              <th className="pb-3 font-semibold">Date & Time</th>
              <th className="pb-3 font-semibold">Cashier</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Method</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 font-semibold text-primary">#{tx.receiptNumber}</td>
                <td className="py-4 text-secondary">{new Date(tx.timestamp).toLocaleString()}</td>
                <td className="py-4 font-medium">{tx.cashier?.name || 'Unknown'}</td>
                <td className="py-4 font-bold">${tx.totals?.grandTotal?.toFixed(2) || '0.00'}</td>
                <td className="py-4">
                  <span className="bg-gray-100 text-secondary px-2 py-1 rounded-md font-medium text-xs">
                    {tx.payment?.method || 'N/A'}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 flex justify-end space-x-2">
                  <button className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Reprint Receipt">
                    <Printer size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
