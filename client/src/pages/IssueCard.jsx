import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

function IssueCard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student' });
      return;
    }

    setIssuing(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/cards/issue', { studentId: selectedStudent });
      setMessage({ type: 'success', text: 'Card issued successfully!' });
      setTimeout(() => navigate(`/cards/view/${selectedStudent}`), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to issue card' });
    } finally {
      setIssuing(false);
    }
  };

  const selectedStudentData = students.find(s => s.studentId === selectedStudent);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Issue Student Card</h1>
          <p className="text-gray-600">Issue a new blockchain-based student ID card</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Student</h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No students available</p>
                <button
                  onClick={() => navigate('/students/add')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add a student first
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a student to issue card
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student.studentId}>
                        {student.fullName} ({student.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                {message.text && (
                  <div className={`px-4 py-3 rounded-lg ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handleIssue}
                  disabled={!selectedStudent || issuing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {issuing ? 'Issuing Card...' : 'Issue Card'}
                </button>
              </div>
            )}
          </div>

          {selectedStudentData && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                <div className="text-center mb-4">
                  <p className="text-sm opacity-75">OFFICIAL STUDENT ID</p>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4">
                  {selectedStudentData.profilePhotoUrl ? (
                    <img
                      src={selectedStudentData.profilePhotoUrl}
                      alt={selectedStudentData.fullName}
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl text-gray-400">👤</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{selectedStudentData.fullName}</h3>
                  <p className="text-lg opacity-90">{selectedStudentData.studentId}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="opacity-75">Department</p>
                    <p className="font-medium">{selectedStudentData.department}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Course</p>
                    <p className="font-medium">{selectedStudentData.course}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueCard;