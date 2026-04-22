import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/students/add', label: 'Add Student', icon: '➕' },
    { path: '/cards/issue', label: 'Issue Card', icon: '💳' },
    { path: '/verify', label: 'Verify', icon: '✅' },
    { path: '/blockchain/terminal', label: 'Terminal', icon: '⌨️' },
    { path: '/blockchain/transactions', label: 'Transactions', icon: '📜' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-blue-400">Student ID</h1>
        <p className="text-sm text-gray-400 text-center">Blockchain System</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full mt-8 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;