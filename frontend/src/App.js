import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicStatusPage from './pages/PublicStatusPage';
import TeamManagement from './pages/TeamManagement';
import ServiceManagement from './pages/ServiceManagement';
import IncidentManagement from './pages/IncidentManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:orgSlug" element={<PublicStatusPage />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/teams" element={<TeamManagement />} />
                    <Route path="/services" element={<ServiceManagement />} />
                    <Route path="/incidents" element={<IncidentManagement />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
