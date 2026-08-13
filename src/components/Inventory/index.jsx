import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosClient.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axiosClient.delete(`/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Failed to delete product.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }
  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text">Product Inventory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-secondary">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Price</th>
              <th className="pb-3 font-semibold">Stock</th>
              <th className="pb-3 font-semibold">Type</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium">{product.name}</td>
                <td className="py-4 text-secondary">{product.category?.name || 'Uncategorized'}</td>
                <td className="py-4 font-semibold">${product.price.toFixed(2)}</td>
                <td className="py-4">
                  {product.isWeighed ? <span className="text-secondary">-</span> : product.stock}
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isWeighed ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {product.isWeighed ? 'Weighed' : 'Unit'}
                  </span>
                </td>
                <td className="py-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddProductModal 
          onClose={() => setIsModalOpen(false)} 
          onProductAdded={fetchProducts} 
        />
      )}

      {editingProduct && (
        <EditProductModal 
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={fetchProducts}
        />
      )}
    </div>
  );
}
