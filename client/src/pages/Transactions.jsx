import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getBlockchainLogs } from '../utils/api';

function Transactions() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await getBlockchainLogs();
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.type === filter);

  const getTypeColor = (type) => {
    switch (type) {
      case 'ISSUE': return 'bg-green-100 text-green-800 border-green-300';
      case 'REVOKE': return 'bg-red-100 text-red-800 border-red-300';
      case 'VERIFY': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ISSUE': return '💳';
      case 'REVOKE': return '🚫';
      case 'VERIFY': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blockchain Transactions</h1>
          <p className="text-gray-600">Visual representation of all blockchain activity</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['ALL', 'ISSUE', 'REVOKE', 'VERIFY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {f === 'ALL' ? '📋 All' : f === 'ISSUE' ? '💳 Issue' : f === 'REVOKE' ? '🚫 Revoke' : '✅ Verify'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Transactions</h2>
            <p className="text-gray-600">No {filter === 'ALL' ? '' : filter.toLowerCase()} transactions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(log.type)}`}>
                      {getTypeIcon(log.type)} {log.type}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    #{log.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.data.studentId && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Student ID</div>
                      <div className="text-lg font-semibold text-gray-800">{log.data.studentId}</div>
                    </div>
                  )}
                  {log.data.studentName && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Student Name</div>
                      <div className="text-lg font-semibold text-gray-800">{log.data.studentName}</div>
                    </div>
                  )}
                  {log.data.recordId && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Blockchain Record ID</div>
                      <div className="font-mono text-gray-800">{log.data.recordId}</div>
                    </div>
                  )}
                  {log.data.txHash && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Transaction Hash</div>
                      <div className="font-mono text-sm text-blue-600 break-all">{log.data.txHash}</div>
                    </div>
                  )}
                  {log.data.status && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Status</div>
                      <div className={`font-semibold ${log.data.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                        {log.data.status}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-green-500">●</span>
                    <span>Confirmed on blockchain</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;