import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getBlockchainLogs, clearBlockchainLogs } from '../utils/api';

function BlockchainTerminal() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      if (autoRefresh) fetchLogs();
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
    if (confirm('Clear all logs?')) {
      await clearBlockchainLogs();
      fetchLogs();
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ISSUE': return 'bg-neon-500/20 border-neon-500/40 text-neon-400';
      case 'REVOKE': return 'bg-red-500/20 border-red-500/40 text-red-400';
      case 'VERIFY': return 'bg-accent-500/20 border-accent-500/40 text-accent-400';
      default: return 'bg-surface-700 border-surface-600 text-surface-400';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Terminal</h1>
            <p className="text-surface-500 mt-1">Real-time chain monitor</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchLogs} className="btn-secondary text-sm">
              ↻
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`btn-secondary text-sm ${autoRefresh ? 'text-green-400 border-green-500/40' : ''}`}
            >
              {autoRefresh ? '●' : '○'}
            </button>
            <button onClick={handleClear} className="btn-secondary text-sm text-red-400 hover:bg-red-500/10">
              ⊗
            </button>
          </div>
        </div>

        <div className="bg-surface-950 rounded-xl overflow-hidden border border-surface-700">
          <div className="bg-surface-900 px-4 py-2 flex items-center justify-between border-b border-surface-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono text-green-400">chain-node</span>
            </div>
            <span className="text-xs text-surface-500">{logs.length} tx</span>
          </div>

          <div className="p-4 font-mono text-xs max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-surface-500">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-surface-500">Waiting for transactions...</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="mb-3 p-3 bg-surface-900 rounded-lg border-l-2 border-neon-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs border ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                    <span className="text-surface-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-neon-400 mb-1">▲ {log.data.txHash || 'simulated'}</div>
                  {log.data.studentId && (
                    <div className="text-surface-400">
                      <span className="text-surface-500">ID:</span> {log.data.studentId}
                      <span className="mx-2">|</span>
                      <span className="text-surface-500">Name:</span> {log.data.studentName}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="bg-surface-900 px-4 py-2 border-t border-surface-700">
            <span className="text-green-500">$</span>
            <span className="text-surface-500 ml-2">tail -f chain.log</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-xl mb-1">◆</div>
            <div className="text-xl font-semibold text-zinc-100">{logs.filter(l => l.type === 'ISSUE').length}</div>
            <div className="text-xs text-surface-500">Minted</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xl mb-1">⊗</div>
            <div className="text-xl font-semibold text-zinc-100">{logs.filter(l => l.type === 'REVOKE').length}</div>
            <div className="text-xs text-surface-500">Revoked</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xl mb-1">◎</div>
            <div className="text-xl font-semibold text-zinc-100">{logs.filter(l => l.type === 'VERIFY').length}</div>
            <div className="text-xs text-surface-500">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockchainTerminal;