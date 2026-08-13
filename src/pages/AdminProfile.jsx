import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminProfile() {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [pinCode, setPinCode] = useState('');

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!name) {
      setStatus({ type: 'error', message: 'Name is required' });
      return;
    }

    setLoading(true);
    try {
      const updatePayload = {
        name,
        employeeId: currentUser.employeeId,
        role: currentUser.role,
        isActive: currentUser.isActive
      };

      // Only send pinCode if they intend to change it
      if (pinCode.trim()) {
        updatePayload.pinCode = pinCode;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      updateProfile({ name: data.name });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setPinCode(''); // clear password field after update
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-8">Admin Profile</h1>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{currentUser?.name}</h2>
            <p className="text-secondary text-sm">Role: {currentUser?.role} | ID: {currentUser?.employeeId}</p>
          </div>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center space-x-3 text-sm font-medium ${status.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
            }`}>
            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-secondary" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Admin ID (Read Only)</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary cursor-not-allowed"
                value={currentUser?.employeeId}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-2">Update PIN Code (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-secondary" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Leave blank to keep current PIN"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>
              <p className="text-xs text-secondary mt-2">Only fill this if you want to change your login PIN.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform active:scale-95 ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
                }`}
            >
              <Save size={20} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
