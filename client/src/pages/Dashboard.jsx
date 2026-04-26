import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalIssuedCards: 0,
    activeCards: 0,
    revokedCards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/students/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Employees', value: stats.totalStudents, icon: '◈', color: 'neon' },
    { label: 'Minted IDs', value: stats.totalIssuedCards, icon: '◆', color: 'accent' },
    { label: 'Active', value: stats.activeCards, icon: '◇', color: 'green' },
    { label: 'Revoked', value: stats.revokedCards, icon: '▣', color: 'red' },
  ];

  const getColorClass = (color) => {
    switch(color) {
      case 'neon': return 'text-neon-400 bg-neon-500/10 border-neon-500/30';
      case 'accent': return 'text-accent-400 bg-accent-500/10 border-accent-500/30';
      case 'green': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return '';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100">Overview</h1>
          <p className="text-surface-500 mt-1">System status and metrics</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-surface-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-3xl font-semibold text-zinc-100 mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClass(card.color)}`}>
                    <span className="text-xl">{card.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 glass-card p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">System Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-neon-500/10 border border-neon-500/30 rounded-xl flex items-center justify-center">
                <span className="text-neon-400 text-xl">①</span>
              </div>
              <h3 className="font-medium text-zinc-200">Register Employee</h3>
              <p className="text-sm text-surface-500 mt-1">Add credentials to the system</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-accent-500/10 border border-accent-500/30 rounded-xl flex items-center justify-center">
                <span className="text-accent-400 text-xl">②</span>
              </div>
              <h3 className="font-medium text-zinc-200">Mint on Chain</h3>
              <p className="text-sm text-surface-500 mt-1">Issue verifiable ID tokens</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center">
                <span className="text-green-400 text-xl">③</span>
              </div>
              <h3 className="font-medium text-zinc-200">Verify</h3>
              <p className="text-sm text-surface-500 mt-1">Anyone can audit authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;