import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function CategoryModal({ category, onClose, onSaved }) {
  const isEditing = !!category;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#3b82f6'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        await axiosClient.put(`/categories/${category._id}`, formData);
      } else {
        await axiosClient.post('/categories', formData);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Make sure the name is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-text transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1">Category Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="e.g. Desserts"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-1">UI Color</label>
            <div className="flex items-center space-x-3">
              <input 
                type="color" 
                required
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
              />
              <span className="text-sm font-mono text-secondary">{formData.color}</span>
            </div>
            <p className="text-xs text-secondary mt-1">This color is used for POS terminal buttons.</p>
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{isEditing ? 'Save Changes' : 'Add Category'}</span>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
