import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import IssueCard from './pages/IssueCard';
import EmployeeCard from './pages/EmployeeCard';
import Verify from './pages/Verify';
import BlockchainTerminal from './pages/BlockchainTerminal';
import Transactions from './pages/Transactions';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-surface-950 font-display">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/employees/add" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/cards/issue" element={<PrivateRoute><IssueCard /></PrivateRoute>} />
          <Route path="/cards/view/:employeeId" element={<PrivateRoute><EmployeeCard /></PrivateRoute>} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/blockchain/terminal" element={<PrivateRoute><BlockchainTerminal /></PrivateRoute>} />
          <Route path="/blockchain/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;