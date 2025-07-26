
// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import CaseOpening from './pages/CaseOpening';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/case-opening" element={<CaseOpening />} />
      </Routes>
    </Router>
  );
}

export default App;
