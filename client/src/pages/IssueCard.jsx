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
      setMessage({ type: 'error', text: 'Select a student first' });
      return;
    }

    setIssuing(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/cards/issue', { studentId: selectedStudent });
      setMessage({ type: 'success', text: 'ID minted successfully on chain' });
      setTimeout(() => navigate(`/cards/view/${selectedStudent}`), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Mint failed' });
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
          <h1 className="text-2xl font-semibold text-zinc-100">Mint ID</h1>
          <p className="text-surface-500 mt-1">Issue blockchain-verifiable credential</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h2 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Select Credential</h2>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-surface-500 mb-3">No credentials available</div>
                <button
                  onClick={() => navigate('/students/add')}
                  className="text-neon-400 hover:text-neon-300"
                >
                  Register first →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Choose student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student.studentId}>
                        {student.fullName} — {student.studentId}
                      </option>
                    ))}
                  </select>
                </div>

                {message.text && (
                  <div className={`px-4 py-3 rounded-lg text-sm ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handleIssue}
                  disabled={!selectedStudent || issuing}
                  className="w-full btn-primary"
                >
                  {issuing ? 'Minting...' : 'Mint to Chain ◆'}
                </button>
              </div>
            )}
          </div>

          {selectedStudentData && (
            <div className="glass-card p-5">
              <h2 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">Preview</h2>
              <div className="bg-gradient-to-br from-surface-800 to-surface-900 rounded-xl p-5 border border-surface-700">
                <div className="text-center mb-4">
                  <p className="text-xs text-surface-500 uppercase tracking-widest">Digital ID</p>
                </div>
                <div className="bg-surface-800 rounded-lg p-4 mb-4">
                  {selectedStudentData.profilePhotoUrl ? (
                    <img
                      src={selectedStudentData.profilePhotoUrl}
                      alt={selectedStudentData.fullName}
                      className="w-20 h-20 mx-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-surface-700 rounded-lg flex items-center justify-center">
                      <span className="text-3xl text-surface-500">◇</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-zinc-100">{selectedStudentData.fullName}</h3>
                  <p className="text-sm text-neon-400 mt-1 font-mono">{selectedStudentData.studentId}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-surface-500">Dept</p>
                    <p className="text-zinc-300">{selectedStudentData.department}</p>
                  </div>
                  <div>
                    <p className="text-surface-500">Course</p>
                    <p className="text-zinc-300">{selectedStudentData.course}</p>
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