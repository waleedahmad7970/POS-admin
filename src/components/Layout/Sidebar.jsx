import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ReceiptText, Settings, Tags, ArrowRightLeft, Users, Clock, Calculator } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Stock Control', path: '/stock', icon: ArrowRightLeft },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Transactions', path: '/transactions', icon: ReceiptText },
  { name: 'Till Reports', path: '/till-reports', icon: Calculator },
  { name: 'Staff', path: '/staff', icon: Users },
  { name: 'Timesheets', path: '/timesheets', icon: Clock },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">EPOS<span className="text-text">Admin</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-secondary hover:bg-gray-100 hover:text-text'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium ${
              isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-secondary hover:bg-gray-100 hover:text-text'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
}
