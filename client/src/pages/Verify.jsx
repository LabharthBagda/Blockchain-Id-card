import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';

function Verify() {
  const [searchParams] = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const idFromUrl = searchParams.get('studentId');
    if (idFromUrl) {
      setStudentId(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, [searchParams]);

  const handleVerify = async (id = studentId) => {
    if (!id.trim()) {
      setError('Enter a credential ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.get(`/cards/verify/${id}`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REVOKED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-surface-700 text-surface-400 border-surface-600';
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-500/5 rounded-full blur-[120px]"></div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-800 border border-surface-700 rounded-2xl mb-6">
            <span className="text-neon-400 text-2xl">◆</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100">Verify Credential</h1>
          <p className="text-surface-500 mt-1">Authenticate on-chain data</p>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="input-field flex-1"
                placeholder="Enter credential ID"
              />
              <button type="submit" disabled={loading} className="btn-primary px-6">
                {loading ? '...' : '◎'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-5">
              <div className={`px-4 py-3 rounded-t-xl border flex items-center justify-center gap-2 ${getStatusStyle(result.status)}`}>
                <span className="text-lg font-semibold">
                  {result.status === 'ACTIVE' ? '✓ Valid' : result.status === 'REVOKED' ? '✗ Revoked' : '? Unknown'}
                </span>
              </div>

              <div className="bg-surface-900 rounded-b-xl p-5">
                {result.status !== 'NOT_FOUND' && result.status !== 'INACTIVE' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-500 text-xs">Name</p>
                      <p className="font-medium text-zinc-200">{result.studentName}</p>
                    </div>
                    <div>
                      <p className="text-surface-500 text-xs">ID</p>
                      <p className="font-mono text-neon-400">{result.studentId}</p>
                    </div>
                    <div>
                      <p className="text-surface-500 text-xs">Department</p>
                      <p className="text-zinc-300">{result.department}</p>
                    </div>
                    <div>
                      <p className="text-surface-500 text-xs">Course</p>
                      <p className="text-zinc-300">{result.course}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-surface-500 text-xs">Issue Date</p>
                      <p className="text-zinc-300">
                        {new Date(result.issueTimestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-surface-700">
                  <div className="flex items-center justify-center gap-2 text-xs text-surface-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Ethereum Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-surface-700 text-center">
            <a href="/login" className="text-sm text-surface-500 hover:text-neon-400">
              Admin Access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;