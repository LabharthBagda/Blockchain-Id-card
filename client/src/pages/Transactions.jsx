import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getBlockchainLogs } from '../utils/api';

function Transactions() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const response = await getBlockchainLogs();
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.type === filter);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'ISSUE': return 'bg-neon-500/10 border-neon-500/40 text-neon-400';
      case 'REVOKE': return 'bg-red-500/10 border-red-500/40 text-red-400';
      case 'VERIFY': return 'bg-accent-500/10 border-accent-500/40 text-accent-400';
      default: return 'bg-surface-700 border-surface-600 text-surface-400';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100">Activity</h1>
          <p className="text-surface-500 mt-1">Transaction history</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['ALL', 'ISSUE', 'REVOKE', 'VERIFY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                filter === f 
                  ? 'bg-neon-500/10 border-neon-500/40 text-neon-400' 
                  : 'bg-surface-800 border-surface-700 text-surface-400 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl text-surface-600 mb-4">◇</div>
            <h2 className="text-lg font-medium text-zinc-200 mb-2">No Transactions</h2>
            <p className="text-surface-500">Nothing recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="glass-card p-5 border-l-2 border-l-neon-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeStyle(log.type)}`}>
                      {log.type}
                    </span>
                    <span className="text-surface-500 text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-surface-600 text-xs font-mono">#{log.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {log.data.studentId && (
                    <div>
                      <p className="text-surface-500 text-xs uppercase">Credential ID</p>
                      <p className="font-mono text-neon-400">{log.data.studentId}</p>
                    </div>
                  )}
                  {log.data.studentName && (
                    <div>
                      <p className="text-surface-500 text-xs uppercase">Name</p>
                      <p className="text-zinc-300">{log.data.studentName}</p>
                    </div>
                  )}
                  {log.data.recordId && (
                    <div>
                      <p className="text-surface-500 text-xs uppercase">Chain Record</p>
                      <p className="font-mono text-zinc-400">{log.data.recordId}</p>
                    </div>
                  )}
                  {log.data.txHash && (
                    <div>
                      <p className="text-surface-500 text-xs uppercase">Transaction</p>
                      <p className="font-mono text-xs text-neon-400 truncate">{log.data.txHash}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-surface-700">
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Confirmed on chain</span>
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