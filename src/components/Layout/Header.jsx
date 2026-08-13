import React, { useState } from 'react';
import { Bell, UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-8">
      <div className="text-lg font-semibold text-text">
        {/* Can be dynamic based on route later */}
        Overview
      </div>
      
      <div className="flex items-center space-x-6 relative">
        <button className="text-secondary hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div 
          className="flex items-center space-x-3 border-l border-gray-200 pl-6 cursor-pointer hover:opacity-80"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-text">{currentUser?.name || 'Admin User'}</p>
            <p className="text-xs text-secondary">{currentUser?.role || 'Admin'}</p>
          </div>
          <UserCircle size={32} className="text-primary" />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
            <button 
              onClick={() => { setShowDropdown(false); navigate('/profile'); }}
              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-gray-50 flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Profile Settings</span>
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/10 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
