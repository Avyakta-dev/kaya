import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { I18nProvider } from './i18n/index.jsx';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Log from './pages/Log';
import Insights from './pages/Insights';
import Report from './pages/Report';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const userId = localStorage.getItem('userId');
    console.log('App mounted, userId:', userId, 'isOnboarded:', !!userId);
    setIsOnboarded(!!userId);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[#9d4235] text-[48px]">refresh</span>
    </div>;
  }

  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/"
            element={isOnboarded ? <Home /> : <Navigate to="/onboarding" replace />}
          />
          <Route
            path="/calendar"
            element={isOnboarded ? <Calendar /> : <Navigate to="/onboarding" replace />}
          />
          <Route
            path="/log"
            element={isOnboarded ? <Log /> : <Navigate to="/onboarding" replace />}
          />
          <Route
            path="/insights"
            element={isOnboarded ? <Insights /> : <Navigate to="/onboarding" replace />}
          />
          <Route
            path="/report"
            element={isOnboarded ? <Report /> : <Navigate to="/onboarding" replace />}
          />
          {/* Catch all - redirect to onboarding if not onboarded, else home */}
          <Route
            path="*"
            element={isOnboarded ? <Navigate to="/" replace /> : <Navigate to="/onboarding" replace />}
          />
        </Routes>
      </Router>
    </I18nProvider>
  );
}

export default App;
