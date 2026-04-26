import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/students');
      setEmployees(response.data.students);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Registry</h1>
            <p className="text-surface-500 mt-1">Manage employee credentials</p>
          </div>
          <Link
            to="/employees/add"
            className="btn-primary flex items-center gap-2"
          >
            <span>＋</span>
            <span>New Entry</span>
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-surface-700">
            <input
              type="text"
              placeholder="Search registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl text-surface-600 mb-3">◇</div>
              <p className="text-surface-500">No records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-700">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-neon-400">{employee.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{employee.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{employee.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{employee.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/cards/view/${employee.studentId}`}
                          className="text-neon-400 hover:text-neon-300 transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;