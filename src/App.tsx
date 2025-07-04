import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;