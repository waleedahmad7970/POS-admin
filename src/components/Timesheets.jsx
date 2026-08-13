import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Search, Filter, Download, Edit2, X, Check, Eye, User } from 'lucide-react';

const formatHours = (hours) => {
  if (!hours) return '0s';
  const totalSeconds = Math.floor(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Timesheets() {
  const [attendances, setAttendances] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Edit State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clockInStr, setClockInStr] = useState('');
  const [clockOutStr, setClockOutStr] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editAttendanceType, setEditAttendanceType] = useState('');

  // View Summary State
  const [viewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
  const [selectedUserSummary, setSelectedUserSummary] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/attendance`),
        fetch(`${API_URL}/users`)
      ]);
      const attData = await attRes.json();
      const usersData = await usersRes.json();

      const uMap = {};
      usersData.forEach(u => {
        uMap[u._id] = u.name;
        if (u.employeeId) uMap[u.employeeId] = u.name;
      });

      setUsersMap(uMap);
      setAttendances(attData);
    } catch (err) {
      console.error('Failed to fetch timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = useMemo(() => {
    return attendances.filter(a => {
      const empName = usersMap[a.userId?._id || a.userId] || a.employeeId || '';

      // Search by employee
      if (searchTerm && !empName.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Filter by attendance status
      if (statusFilter && a.attendanceType !== statusFilter) return false;

      // Filter by date range (using clockIn)
      const recordDate = new Date(a.clockIn);
      if (startDate && recordDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (recordDate > end) return false;
      }

      return true;
    });
  }, [attendances, searchTerm, startDate, endDate, statusFilter, usersMap]);

  // Summaries
  const summaries = useMemo(() => {
    let daily = 0, weekly = 0, monthly = 0;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    filteredAttendances.forEach(a => {
      const d = new Date(a.clockIn);
      const hours = a.totalHours || 0;
      if (d >= startOfDay) daily += hours;
      if (d >= startOfWeek) weekly += hours;
      if (d >= startOfMonth) monthly += hours;
    });

    return { daily, weekly, monthly };
  }, [filteredAttendances]);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee,Clock In,Clock Out,Status,Attendance Type,Total Hours\n";

    filteredAttendances.forEach(a => {
      const empName = usersMap[a.userId?._id || a.userId] || a.employeeId;
      const cIn = new Date(a.clockIn).toLocaleString();
      const cOut = a.clockOut ? new Date(a.clockOut).toLocaleString() : 'Active';
      const row = `"${empName}","${cIn}","${cOut}","${a.status}","${a.attendanceType || 'Present'}",${(a.totalHours || 0).toFixed(2)}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timesheets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);

    const inDate = new Date(record.clockIn);
    inDate.setMinutes(inDate.getMinutes() - inDate.getTimezoneOffset());
    setClockInStr(inDate.toISOString().slice(0, 16));

    if (record.clockOut) {
      const outDate = new Date(record.clockOut);
      outDate.setMinutes(outDate.getMinutes() - outDate.getTimezoneOffset());
      setClockOutStr(outDate.toISOString().slice(0, 16));
    } else {
      setClockOutStr('');
    }

    setEditStatus(record.status || 'Clocked In');
    setEditAttendanceType(record.attendanceType || 'Present');
    setEditModalOpen(true);
  };

  const openSummaryModal = (userId, empName) => {
    const userRecords = attendances.filter(a => (a.userId?._id || a.userId) === userId);

    let totalAllTime = 0;
    let totalThisWeek = 0;
    let totalThisMonth = 0;

    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    userRecords.forEach(a => {
      const hrs = a.totalHours || 0;
      const d = new Date(a.clockIn);
      totalAllTime += hrs;
      if (d >= startOfWeek) totalThisWeek += hrs;
      if (d >= startOfMonth) totalThisMonth += hrs;
    });

    setSelectedUserSummary({
      userId,
      name: empName,
      totalAllTime,
      totalThisWeek,
      totalThisMonth,
      shiftCount: userRecords.length
    });
    setViewSummaryModalOpen(true);
  };

  const saveEdit = async () => {
    try {
      const body = {
        clockIn: new Date(clockInStr).toISOString(),
        clockOut: clockOutStr ? new Date(clockOutStr).toISOString() : null,
        status: editStatus,
        attendanceType: editAttendanceType
      };

      const res = await fetch(`${API_URL}/attendance/${editingRecord.attendanceId || editingRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setEditModalOpen(false);
        fetchData();
      } else {
        alert('Failed to update record');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating record');
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center text-secondary">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Timesheets</h1>
          <p className="text-secondary text-sm">Manage employee working hours and attendance</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-secondary text-sm font-medium">Daily Hours (Today)</p>
            <h3 className="text-2xl font-bold text-text">{formatHours(summaries.daily)}</h3>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-50 text-green-500 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-secondary text-sm font-medium">Weekly Hours (This Wk)</p>
            <h3 className="text-2xl font-bold text-text">{formatHours(summaries.weekly)}</h3>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-purple-50 text-purple-500 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-secondary text-sm font-medium">Monthly Hours (This Mo)</p>
            <h3 className="text-2xl font-bold text-text">{formatHours(summaries.monthly)}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-secondary bg-gray-50">
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Clock In</th>
                <th className="px-6 py-4 font-semibold">Clock Out</th>
                <th className="px-6 py-4 font-semibold">Total Hrs</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.map(a => (
                <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text">{usersMap[a.userId?._id || a.userId] || a.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {new Date(a.clockIn).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {a.clockOut ? new Date(a.clockOut).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : <span className="text-orange-500 font-medium text-xs">ACTIVE SHIFT</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-text">{formatHours(a.totalHours || 0)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${(a.attendanceType || 'Present') === 'Present' ? 'bg-green-100 text-green-700' :
                      a.attendanceType === 'Late' ? 'bg-orange-100 text-orange-700' :
                        a.attendanceType === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {a.attendanceType || 'Present'}
                    </span>
                    {a.status === 'Completed' ? (
                      <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500">Completed</span>
                    ) : (
                      <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end space-x-2">
                    <button
                      onClick={() => openSummaryModal(a.userId?._id || a.userId, usersMap[a.userId?._id || a.userId] || a.employeeId)}
                      className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="View Employee Summary"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(a)}
                      className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAttendances.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary">
                    No records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-text">Edit Timesheet</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Clock In</label>
                <input
                  type="datetime-local"
                  value={clockInStr}
                  onChange={e => setClockInStr(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Clock Out</label>
                <input
                  type="datetime-local"
                  value={clockOutStr}
                  onChange={e => setClockOutStr(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Attendance Status</label>
                <select
                  value={editAttendanceType}
                  onChange={e => setEditAttendanceType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Shift Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="Clocked In">Clocked In (Active)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-secondary hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium text-sm flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Summary Modal */}
      {viewSummaryModalOpen && selectedUserSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-text flex items-center space-x-2">
                <User size={20} className="text-primary" />
                <span>Employee Summary</span>
              </h3>
              <button onClick={() => setViewSummaryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {selectedUserSummary.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-text mb-1">{selectedUserSummary.name}</h2>
              <p className="text-secondary text-sm mb-6">Total Shifts: {selectedUserSummary.shiftCount}</p>

              <div className="w-full space-y-3">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-secondary">Hours This Week</span>
                  <span className="font-bold text-text text-lg">{formatHours(selectedUserSummary.totalThisWeek)}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-secondary">Hours This Month</span>
                  <span className="font-bold text-text text-lg">{formatHours(selectedUserSummary.totalThisMonth)}</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
                  <span className="font-medium text-blue-800">All-Time Hours</span>
                  <span className="font-bold text-blue-900 text-xl">{formatHours(selectedUserSummary.totalAllTime)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setViewSummaryModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
