import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

function StudentCard() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [studentId]);

  const fetchCard = async () => {
    try {
      const response = await api.get(`/cards/student/${studentId}`);
      setCard(response.data.card);
      setStudent(response.data.student);
    } catch (err) {
      setError(err.response?.data?.error || 'Card not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke this card?')) return;

    setRevoking(true);
    try {
      await api.post('/cards/revoke', { studentId });
      fetchCard();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to revoke card');
    } finally {
      setRevoking(false);
    }
  };

  const verifyUrl = `${window.location.origin}/verify?studentId=${studentId}`;

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Card Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'No card has been issued for this student'}</p>
            <button
              onClick={() => navigate('/cards/issue')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Issue Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link to="/students" className="text-blue-600 hover:text-blue-800">
            ← Back to Students
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Digital Student ID Card</h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 text-white shadow-2xl card-glow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm opacity-75 tracking-wider">BLOCKCHAIN STUDENT ID</p>
                  <p className="text-xs opacity-50">VERIFIED ON ETHEREUM</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  card.isActive && !card.isRevoked
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}>
                  {card.isActive && !card.isRevoked ? 'VALID' : 'REVOKED'}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-white rounded-xl p-2">
                  {student?.profilePhotoUrl ? (
                    <img
                      src={student.profilePhotoUrl}
                      alt={student.fullName}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-5xl">👤</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{student?.fullName}</h3>
                  <p className="text-xl opacity-90 mb-4">{studentId}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-75">Department</span>
                      <span className="font-medium">{student?.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Course</span>
                      <span className="font-medium">{student?.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Year</span>
                      <span className="font-medium">{student?.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Issued</span>
                      <span className="font-medium">
                        {new Date(card.issueTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="bg-white rounded-lg p-2">
                    <QRCodeSVG value={verifyUrl} size={80} />
                  </div>
                  <div className="text-xs opacity-50 text-right">
                    <p>Blockchain Record ID: {card.blockchainRecordId}</p>
                    <p>Tx: {card.blockchainTxHash?.substring(0, 10)}...</p>
                  </div>
                </div>
              </div>
            </div>

            {card.isActive && !card.isRevoked ? (
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {revoking ? 'Revoking...' : 'Revoke Card'}
              </button>
            ) : card.isRevoked ? (
              <button
                onClick={async () => {
                  try {
                    await api.post('/cards/reactivate', { studentId });
                    fetchCard();
                  } catch (err) {
                    alert(err.response?.data?.error || 'Failed to reactivate card');
                  }
                }}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
              >
                Reactivate Card
              </button>
            ) : null}
          </div>

          <div className="w-full md:w-80">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code or enter the student ID to verify this card.
              </p>
              <Link
                to={`/verify?studentId=${studentId}`}
                className="block text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Open Verify Page
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg mt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Blockchain Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Record ID</p>
                  <p className="font-mono text-gray-800">{card.blockchainRecordId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Issue Timestamp</p>
                  <p className="text-gray-800">{new Date(card.issueTimestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`font-medium ${card.isActive && !card.isRevoked ? 'text-green-600' : 'text-red-600'}`}>
                    {card.isActive && !card.isRevoked ? 'Active' : 'Revoked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;