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
    { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: 'bg-blue-500' },
    { label: 'Total Issued Cards', value: stats.totalIssuedCards, icon: '💳', color: 'bg-green-500' },
    { label: 'Active Cards', value: stats.activeCards, icon: '✅', color: 'bg-emerald-500' },
    { label: 'Revoked Cards', value: stats.revokedCards, icon: '❌', color: 'bg-red-500' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your system.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-4 rounded-xl`}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Add Students</h3>
              <p className="text-sm text-gray-600">Register student information in the system</p>
            </div>
            <div className="text-center p-4">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Issue ID Cards</h3>
              <p className="text-sm text-gray-600">Issue digital ID cards stored on blockchain</p>
            </div>
            <div className="text-center p-4">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Verify Authenticity</h3>
              <p className="text-sm text-gray-600">Anyone can verify card authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;