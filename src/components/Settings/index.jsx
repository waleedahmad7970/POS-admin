import React, { useState } from 'react';
import { Store, ShieldCheck } from 'lucide-react';
import StoreSettings from './StoreSettings';
import AdminManagement from './AdminManagement';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Details', icon: Store },
    { id: 'admins', label: 'Admin Management', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for Settings Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-secondary hover:bg-gray-100 hover:text-text'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            {activeTab === 'store' && <StoreSettings />}
            {activeTab === 'admins' && <AdminManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
