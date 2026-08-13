import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function EditProductModal({ product, onClose, onProductUpdated }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category?._id || '',
    price: product.price,
    stock: product.stock,
    barcode: product.barcode || '',
    isWeighed: product.isWeighed
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosClient.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        barcode: formData.barcode,
        isWeighed: formData.isWeighed,
        stock: formData.isWeighed ? 0 : parseInt(formData.stock) || 0
      };

      await axiosClient.put(`/products/${product._id}`, payload);
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text">Edit Product</h2>
          <button onClick={onClose} className="text-secondary hover:text-text transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1">Product Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1">Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1">Category</label>
              <select 
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-surface"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.length === 0 && <option value="">Loading...</option>}
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-1">Barcode (Optional)</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              placeholder="Scan or type barcode"
              value={formData.barcode}
              onChange={e => setFormData({...formData, barcode: e.target.value})}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent form submission from barcode scanner
                }
              }}
            />
            <p className="text-xs text-secondary mt-1">Click here and scan the item to link the barcode.</p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input 
              type="checkbox" 
              id="isWeighed"
              className="w-5 h-5 rounded text-primary focus:ring-primary/50"
              checked={formData.isWeighed}
              onChange={e => setFormData({...formData, isWeighed: e.target.checked})}
            />
            <label htmlFor="isWeighed" className="text-sm font-medium text-text cursor-pointer">
              Item is weighed on scale
            </label>
          </div>

          {!formData.isWeighed && (
            <div>
              <label className="block text-sm font-semibold text-secondary mb-1">Stock</label>
              <input 
                type="number" 
                min="0"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          )}

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
              disabled={loading || categories.length === 0}
              className="px-6 py-2 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Save Changes</span>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
