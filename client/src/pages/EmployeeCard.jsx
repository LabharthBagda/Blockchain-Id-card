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
      setError(err.response?.data?.error || 'Credential not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Revoke this credential? This cannot be undone.')) return;
    setRevoking(true);
    try {
      await api.post('/cards/revoke', { studentId });
      fetchCard();
    } catch (err) {
      alert(err.response?.data?.error || 'Revoke failed');
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
          <div className="w-8 h-8 border-2 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="glass-card p-8 text-center">
            <div className="text-5xl text-surface-600 mb-4">◇</div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Not Found</h2>
            <p className="text-surface-500 mb-6">{error || 'No credential issued'}</p>
            <button onClick={() => navigate('/cards/issue')} className="btn-primary">
              Mint New →
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
          <Link to="/employees" className="text-neon-400 hover:text-neon-300 text-sm">
            ← Back to Registry
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl p-6 border border-surface-700 neon-glow">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs text-surface-400 uppercase tracking-widest">CertChain ID</p>
                  <p className="text-xs text-surface-600">Verifiable on Ethereum</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  card.isActive && !card.isRevoked
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {card.isActive && !card.isRevoked ? 'VALID' : 'REVOKED'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="bg-surface-800 rounded-xl p-2">
                  {student?.profilePhotoUrl ? (
                    <img src={student.profilePhotoUrl} alt={student.fullName} className="w-28 h-28 rounded-lg object-cover" />
                  ) : (
                    <div className="w-28 h-28 bg-surface-700 rounded-lg flex items-center justify-center">
                      <span className="text-4xl text-surface-500">◇</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-zinc-100">{student?.fullName}</h3>
                  <p className="text-neon-400 font-mono mt-1">{studentId}</p>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-center sm:justify-between text-surface-400">
                      <span>Department</span>
                      <span className="text-zinc-300">{student?.department}</span>
                    </div>
                    <div className="flex justify-center sm:justify-between text-surface-400">
                      <span>Course</span>
                      <span className="text-zinc-300">{student?.course}</span>
                    </div>
                    <div className="flex justify-center sm:justify-between text-surface-400">
                      <span>Year</span>
                      <span className="text-zinc-300">{student?.year}</span>
                    </div>
                    <div className="flex justify-center sm:justify-between text-surface-400">
                      <span>Issued</span>
                      <span className="text-zinc-300">{new Date(card.issueTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-surface-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="bg-white rounded-lg p-2">
                    <QRCodeSVG value={verifyUrl} size={70} />
                  </div>
                  <div className="text-xs text-surface-500 font-mono text-right">
                    <p>Record: {card.blockchainRecordId}</p>
                    <p>Tx: {card.blockchainTxHash?.slice(0, 12)}...</p>
                  </div>
                </div>
              </div>
            </div>

            {card.isActive && !card.isRevoked ? (
              <button onClick={handleRevoke} disabled={revoking} className="w-full mt-4 btn-secondary text-red-400 hover:bg-red-500/10">
                {revoking ? 'Revoking...' : 'Revoke Credential'}
              </button>
            ) : card.isRevoked ? (
              <button
                onClick={async () => {
                  try {
                    await api.post('/cards/reactivate', { studentId });
                    fetchCard();
                  } catch (err) {}
                }}
                className="w-full mt-4 btn-primary"
              >
                Reactivate Credential
              </button>
            ) : null}
          </div>

          <div className="w-full lg:w-72">
            <div className="glass-card p-5">
              <h3 className="text-sm font-medium text-zinc-300 mb-3 uppercase tracking-wider">Verification</h3>
              <p className="text-sm text-surface-500 mb-4">Scan QR or enter ID to verify</p>
              <Link to={`/verify?studentId=${studentId}`} className="btn-secondary w-full text-center block">
                Open Verifier
              </Link>
            </div>

            <div className="glass-card p-5 mt-4">
              <h3 className="text-sm font-medium text-zinc-300 mb-3 uppercase tracking-wider">Chain Data</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-surface-500">Record ID</p>
                  <p className="font-mono text-zinc-300">{card.blockchainRecordId}</p>
                </div>
                <div>
                  <p className="text-surface-500">Timestamp</p>
                  <p className="text-zinc-300">{new Date(card.issueTimestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-surface-500">Status</p>
                  <p className={`font-medium ${card.isActive && !card.isRevoked ? 'text-green-400' : 'text-red-400'}`}>
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