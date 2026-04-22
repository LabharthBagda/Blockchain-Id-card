import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import IssueCard from './pages/IssueCard';
import StudentCard from './pages/StudentCard';
import Verify from './pages/Verify';
import BlockchainTerminal from './pages/BlockchainTerminal';
import Transactions from './pages/Transactions';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/students/add" element={<PrivateRoute><AddStudent /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
        <Route path="/cards/issue" element={<PrivateRoute><IssueCard /></PrivateRoute>} />
        <Route path="/cards/view/:studentId" element={<PrivateRoute><StudentCard /></PrivateRoute>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/blockchain/terminal" element={<PrivateRoute><BlockchainTerminal /></PrivateRoute>} />
        <Route path="/blockchain/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;