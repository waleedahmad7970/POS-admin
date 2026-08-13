import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Loader2, Tags } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import CategoryModal from './CategoryModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', null
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosClient.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
      alert('Failed to delete category. Ensure no products are currently using it.');
    }
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setModalMode('add');
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <Tags size={24} className="text-primary" />
          Product Categories
        </h2>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-secondary">
              <th className="pb-3 font-semibold">Color</th>
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <div 
                    className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                    style={{ backgroundColor: cat.color }}
                    title={cat.color}
                  />
                </td>
                <td className="py-4 font-medium">{cat.name}</td>
                <td className="py-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="py-8 text-center text-secondary">
                  No categories found. Click 'Add Category' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <CategoryModal 
          category={selectedCategory}
          onClose={() => setModalMode(null)} 
          onSaved={fetchCategories} 
        />
      )}
    </div>
  );
}
