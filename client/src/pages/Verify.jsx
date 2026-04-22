import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
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
      setError('Please enter a student ID');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'REVOKED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Valid';
      case 'REVOKED':
        return 'Revoked';
      default:
        return 'Not Found';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxOiIxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMTIgMTRjLTMuMzE0IDAtNiAyLjY4Ni02IDZ0Mi42ODYgNiA2IDYgNi0yLjY4NiA2LTYtMi42ODYtNi02LTZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Verify Student ID</h1>
            <p className="text-blue-200">Check the authenticity of a blockchain-issued student ID card</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Student ID"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Verify'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6">
                <div className={`px-4 py-3 rounded-t-lg flex items-center justify-center gap-2 ${getStatusColor(result.status)}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {result.status === 'ACTIVE' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : result.status === 'REVOKED' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 .894-.552 1.684-1.377 2.072-.247.116-.528.181-.823.181-.947 0-1.797-.672-2.157-1.559a3 3 0 00-2.289-1.256c-.942.035-1.791.679-2.157 1.559M12 15v2m0 0v2m0-2h2m-2 0H9" />
                    )}
                  </svg>
                  <span className="text-xl font-bold text-white">
                    {getStatusText(result.status)}
                  </span>
                </div>

                <div className="bg-white rounded-b-lg p-6">
                  {result.status !== 'NOT_FOUND' && result.status !== 'INACTIVE' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-semibold text-gray-800">{result.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="font-semibold text-gray-800">{result.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-semibold text-gray-800">{result.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Course</p>
                        <p className="font-semibold text-gray-800">{result.course}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Issue Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(result.issueTimestamp * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Verified on Blockchain</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-blue-200">
              <a href="/login" className="hover:text-white">Admin Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;