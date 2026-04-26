import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

function AddEmployee() {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    department: '',
    course: '',
    year: '',
    profilePhotoUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/students', formData);
      setSuccess('Credential registered successfully');
      setTimeout(() => navigate('/employees'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Sales', 'IT Support'];
  const courses = ['Manager', 'Senior Lead', 'Junior Associate', 'Intern', 'Contractor'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100">Register</h1>
          <p className="text-surface-500 mt-1">Add new employee credential</p>
        </div>

        <div className="glass-card p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Employee ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="EMP2024001"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Position</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Position</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-surface-400 mb-2 uppercase tracking-wider">Photo URL</label>
                <input
                  type="url"
                  name="profilePhotoUrl"
                  value={formData.profilePhotoUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Registering...' : 'Register Credential'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;