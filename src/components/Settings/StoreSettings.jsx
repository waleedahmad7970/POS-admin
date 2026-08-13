import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function StoreSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    contactNumber: '',
    taxRate: '20'
  });

  useEffect(() => {
    // Load from localStorage on mount
    const savedSettings = localStorage.getItem('epos_store_settings');
    if (savedSettings) {
      try {
        setFormData(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network request for UX
    setTimeout(() => {
      localStorage.setItem('epos_store_settings', JSON.stringify(formData));
      setLoading(false);
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text">Store Profile</h2>
        <p className="text-sm text-secondary">Manage your business information and tax configurations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-secondary mb-2">Store Name</label>
            <input 
              type="text" 
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="e.g. My Awesome Shop"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-background"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-secondary mb-2">Store Address</label>
            <textarea 
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              placeholder="123 Main Street, City, Country"
              rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-background resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">Contact Number</label>
            <input 
              type="text" 
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">Default Tax Rate (%)</label>
            <input 
              type="number" 
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              placeholder="20"
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-background"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>

          {success && (
            <span className="text-success text-sm font-medium animate-in fade-in">
              Settings saved successfully!
            </span>
          )}
        </div>

      </form>
    </div>
  );
}
