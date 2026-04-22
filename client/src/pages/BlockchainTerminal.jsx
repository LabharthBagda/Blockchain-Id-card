import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getBlockchainLogs, clearBlockchainLogs } from '../utils/api';

function BlockchainTerminal() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLogs();
    
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchLogs();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

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

  const handleClear = async () => {
    if (confirm('Clear all transaction logs?')) {
      await clearBlockchainLogs();
      fetchLogs();
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ISSUE': return 'bg-green-500';
      case 'REVOKE': return 'bg-red-500';
      case 'VERIFY': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ISSUE': return '➕';
      case 'REVOKE': return '❌';
      case 'VERIFY': return '🔍';
      default: return '📝';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Blockchain Terminal</h1>
            <p className="text-gray-600">Monitor real-time blockchain transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg ${autoRefresh ? 'bg-green-600' : 'bg-gray-600'} text-white`}
            >
              {autoRefresh ? '⏸ Auto' : '▶ Auto'}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span className="text-green-400 text-sm font-mono">blockchain-node</span>
            </div>
            <div className="text-gray-500 text-sm">
              {logs.length} transaction(s)
            </div>
          </div>

          <div className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-gray-500">No transactions yet. Issue a card to see activity.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="mb-4 p-3 bg-gray-900 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs text-white ${getTypeColor(log.type)}`}>
                        {getTypeIcon(log.type)} {log.type}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-green-400 text-xs mb-1">
                    ▲ Transaction Hash
                  </div>
                  <div className="text-green-300 text-xs mb-2 break-all">
                    {log.data.txHash || 'N/A'}
                  </div>
                  {log.data.studentId && (
                    <>
                      <div className="text-gray-400 text-xs">
                        Student ID: <span className="text-white">{log.data.studentId}</span>
                      </div>
                      <div className="text-gray-400 text-xs">
                        Student Name: <span className="text-white">{log.data.studentName}</span>
                      </div>
                      <div className="text-gray-400 text-xs">
                        Record ID: <span className="text-white">{log.data.recordId}</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="bg-gray-900 px-4 py-2 border-t border-gray-800">
            <span className="text-green-500">$</span>
            <span className="text-gray-400 ml-2">tail -f blockchain.log</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl mb-1">💳</div>
            <div className="text-2xl font-bold text-gray-800">
              {logs.filter(l => l.type === 'ISSUE').length}
            </div>
            <div className="text-sm text-gray-600">Cards Issued</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl mb-1">❌</div>
            <div className="text-2xl font-bold text-gray-800">
              {logs.filter(l => l.type === 'REVOKE').length}
            </div>
            <div className="text-sm text-gray-600">Cards Revoked</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl mb-1">🔍</div>
            <div className="text-2xl font-bold text-gray-800">
              {logs.filter(l => l.type === 'VERIFY').length}
            </div>
            <div className="text-sm text-gray-600">Verifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockchainTerminal;