import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/index.jsx';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Log from './pages/Log';
import Insights from './pages/Insights';
import Report from './pages/Report';

function App() {
  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<Log />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Router>
    </I18nProvider>
  );
}

export default App;
