import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function StaffModal({ user, onClose, onSaved }) {
  const isEditing = !!user;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    pinCode: user?.pinCode || '',
    role: user?.role || 'Cashier',
    isActive: user ? user.isActive : true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        await axiosClient.put(`/users/${user._id}`, formData);
      } else {
        await axiosClient.post('/users', formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.response?.data?.message || 'Failed to save user. Check if PIN is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-text transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1">Login PIN</label>
              <input 
                type="text" 
                required
                maxLength="6"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="4-6 digits"
                value={formData.pinCode}
                onChange={e => setFormData({...formData, pinCode: e.target.value.replace(/\D/g, '')})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1">Role</label>
              <select 
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-surface"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              className="w-5 h-5 rounded text-primary focus:ring-primary/50"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-text cursor-pointer">
              Active (Can login to POS)
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-semibold text-secondary hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{isEditing ? 'Save Changes' : 'Add Staff'}</span>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
