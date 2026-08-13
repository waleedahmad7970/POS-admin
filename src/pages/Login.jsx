import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      pinCode: ''
    },
    validationSchema: Yup.object({
      employeeId: Yup.string().required('Admin ID is required'),
      pinCode: Yup.string().required('PIN Code is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        login(data);
        navigate('/');
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
            <p className="text-secondary">Sign in to access store management</p>
          </div>

          {error && (
            <div className="bg-danger/10 text-danger p-4 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Admin ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-secondary" />
                </div>
                <input
                  type="text"
                  name="employeeId"
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${
                    formik.touched.employeeId && formik.errors.employeeId ? 'border-danger' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  placeholder="Enter your Admin ID"
                  value={formik.values.employeeId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.employeeId && formik.errors.employeeId && (
                <p className="text-danger text-xs mt-1">{formik.errors.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">PIN Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-secondary" />
                </div>
                <input
                  type="password"
                  name="pinCode"
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${
                    formik.touched.pinCode && formik.errors.pinCode ? 'border-danger' : 'border-gray-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  placeholder="Enter your PIN"
                  value={formik.values.pinCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.pinCode && formik.errors.pinCode && (
                <p className="text-danger text-xs mt-1">{formik.errors.pinCode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
                formik.isSubmitting ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {formik.isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
