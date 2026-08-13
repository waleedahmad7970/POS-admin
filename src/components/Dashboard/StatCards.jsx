import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Banknote } from 'lucide-react';

export default function StatCards({ transactions = [] }) {
  // Compute data
  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.totals?.grandTotal || 0), 0);
  const cardRevenue = transactions.filter(tx => tx.payment?.method === 'Card').reduce((sum, tx) => sum + (tx.totals?.grandTotal || 0), 0);
  const cashRevenue = transactions.filter(tx => tx.payment?.method === 'Cash').reduce((sum, tx) => sum + (tx.totals?.grandTotal || 0), 0);

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Transactions', value: transactions.length.toString(), icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { title: 'Card Payments', value: `$${cardRevenue.toFixed(2)}`, icon: CreditCard, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'Cash Payments', value: `$${cashRevenue.toFixed(2)}`, icon: Banknote, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className={`${stat.bg} ${stat.color} p-4 rounded-xl mr-4`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary">{stat.title}</p>
            <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
