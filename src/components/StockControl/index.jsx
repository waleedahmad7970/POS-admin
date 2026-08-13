import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Minus, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function StockControl() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustingId, setAdjustingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosClient.get('/products');
      // Filter out weighed items as they don't track discrete unit stock
      const stockableProducts = data.filter(p => !p.isWeighed);
      setProducts(stockableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (id, amount) => {
    setAdjustingId(id);
    try {
      await axiosClient.patch(`/products/${id}/stock`, { amount });
      await fetchProducts(); // Refresh to get updated stock
    } catch (error) {
      console.error('Failed to adjust stock:', error);
      alert('Failed to adjust stock.');
    } finally {
      setAdjustingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <ArrowRightLeft size={24} className="text-primary" />
          Rapid Stock Control
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-secondary">
              <th className="pb-3 font-semibold">Product Name</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold text-center">Current Stock</th>
              <th className="pb-3 font-semibold text-right">Quick Adjustment</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map((product) => {
              const isLowStock = product.stock <= 10;
              const isOut = product.stock === 0;
              
              return (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium flex items-center gap-2">
                    {product.name}
                    {isLowStock && !isOut && <AlertTriangle size={14} className="text-warning" title="Low Stock" />}
                    {isOut && <AlertTriangle size={14} className="text-danger" title="Out of Stock" />}
                  </td>
                  <td className="py-4 text-secondary">{product.category?.name || 'Uncategorized'}</td>
                  
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      isOut ? 'bg-danger/10 text-danger' :
                      isLowStock ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  
                  <td className="py-4">
                    <div className="flex justify-end items-center space-x-2">
                      <button 
                        onClick={() => handleAdjust(product._id, -1)}
                        disabled={adjustingId === product._id || product.stock <= 0}
                        className="w-8 h-8 flex justify-center items-center rounded-lg bg-gray-100 text-secondary hover:bg-danger/10 hover:text-danger disabled:opacity-50 transition-colors"
                        title="Remove 1"
                      >
                        <Minus size={16} />
                      </button>
                      <button 
                        onClick={() => handleAdjust(product._id, 1)}
                        disabled={adjustingId === product._id}
                        className="w-8 h-8 flex justify-center items-center rounded-lg bg-gray-100 text-secondary hover:bg-success/10 hover:text-success disabled:opacity-50 transition-colors"
                        title="Add 1"
                      >
                        <Plus size={16} />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-200 mx-2"></div>

                      <button 
                        onClick={() => handleAdjust(product._id, 10)}
                        disabled={adjustingId === product._id}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
                        title="Add Pack of 10"
                      >
                        +10
                      </button>
                      <button 
                        onClick={() => handleAdjust(product._id, 50)}
                        disabled={adjustingId === product._id}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
                        title="Add Box of 50"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-secondary">
                  No stockable products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
