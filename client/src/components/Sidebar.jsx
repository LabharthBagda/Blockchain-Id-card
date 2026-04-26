import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: '◈' },
    { path: '/employees', label: 'Employees', icon: '◇' },
    { path: '/employees/add', label: 'Register', icon: '＋' },
    { path: '/cards/issue', label: 'Mint ID', icon: '◆' },
    { path: '/verify', label: 'Verify', icon: '◎' },
    { path: '/blockchain/terminal', label: 'Terminal', icon: '▸' },
    { path: '/blockchain/transactions', label: 'Activity', icon: '▹' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-surface-900 border-r border-surface-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-surface-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-neon-400 text-xl">⬡</span>
          <h1 className="text-lg font-semibold tracking-tight">CertChain</h1>
        </div>
        <p className="text-xs text-surface-500 ml-6">Employee Credentials</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-neon-500/10 text-neon-400 border border-neon-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-800'
              }`}
            >
              <span className={`text-sm ${isActive ? 'text-neon-400' : 'text-surface-500'}`}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
        >
          <span className="text-sm">⬏</span>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;