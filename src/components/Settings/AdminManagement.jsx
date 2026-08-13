import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import AdminModal from './AdminModal';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', null
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axiosClient.get('/users');
      // Filter only Admins
      const filteredAdmins = data.filter(user => user.role === 'Admin');
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (admins.length <= 1) {
      alert("Cannot delete the last admin. At least one admin must exist.");
      return;
    }

    if (!window.confirm('Are you sure you want to delete this Admin? They will lose all access to this dashboard.')) return;
    
    try {
      await axiosClient.delete(`/users/${id}`);
      fetchAdmins();
    } catch (error) {
      console.error('Failed to delete admin', error);
      alert('Failed to delete admin.');
    }
  };

  const openAddModal = () => {
    setSelectedAdmin(null);
    setModalMode('add');
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-text mb-1">Admin Management</h2>
          <p className="text-sm text-secondary">Create and manage users with full dashboard access.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={18} />
          <span>New Admin</span>
        </button>
      </div>

      {admins.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-xl border border-dashed border-gray-200">
          <ShieldAlert className="mx-auto h-12 w-12 text-secondary mb-3" />
          <h3 className="text-lg font-medium text-text">No Admins Found</h3>
          <p className="text-secondary mt-1">This shouldn't happen. Please create an admin.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background">
              <tr className="border-b border-gray-200 text-sm text-secondary">
                <th className="py-4 px-4 font-semibold">Admin Name</th>
                <th className="py-4 px-4 font-semibold">Login ID / PIN</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {admins.map((admin) => (
                <tr key={admin._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    {admin.name}
                  </td>
                  <td className="py-4 px-4 font-mono text-secondary">
                    {admin.employeeId} <span className="opacity-50 mx-1">•</span> ****
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {admin.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => openEditModal(admin)}
                      className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Admin"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin._id)}
                      className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalMode && (
        <AdminModal 
          admin={selectedAdmin}
          onClose={() => setModalMode(null)} 
          onSaved={fetchAdmins} 
        />
      )}
    </div>
  );
}
