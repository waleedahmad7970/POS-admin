import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Loader2, Users } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import StaffModal from './StaffModal';

export default function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', null
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosClient.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      await axiosClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user.');
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setModalMode('add');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Staff Management
        </h2>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-secondary">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">PIN Code</th>
              <th className="pb-3 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium">{u.name}</td>
                <td className="py-4 font-mono text-secondary">****</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${u.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-secondary'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {u.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => openEditModal(u)}
                    className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(u._id)}
                    className="p-2 text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-secondary">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <StaffModal 
          user={selectedUser}
          onClose={() => setModalMode(null)} 
          onSaved={fetchUsers} 
        />
      )}
    </div>
  );
}
