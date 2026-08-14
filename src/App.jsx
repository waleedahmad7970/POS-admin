import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import StockControl from './components/StockControl';
import StaffManagement from './components/StaffManagement';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Timesheets from './components/Timesheets';
import Settings from './components/Settings';
import TillReports from './components/TillReports';

import Login from './pages/Login';
import AdminProfile from './pages/AdminProfile';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Layout Component
const AdminLayout = ({ children }) => (
  <div className="flex h-screen bg-background text-text overflow-hidden font-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/stock" element={<StockControl />} />
                  <Route path="/staff" element={<StaffManagement />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/till-reports" element={<TillReports />} />
                  <Route path="/timesheets" element={<Timesheets />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<AdminProfile />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
