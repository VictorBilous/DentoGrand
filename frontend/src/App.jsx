import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CompanyInfo from './components/CompanyInfo.jsx';
import { useAuth } from './auth.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Doctors from './pages/Doctors.jsx';
import Services from './pages/Services.jsx';
import Promotions from './pages/Promotions.jsx';
import Contacts from './pages/Contacts.jsx';
import Privacy from './pages/Privacy.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Records from './pages/Records.jsx';
import PromotionsEdit from './pages/PromotionsEdit.jsx';

function RequireAuth({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/admin" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/actions" element={<Promotions />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/records" element={<RequireAuth><Records /></RequireAuth>} />
          <Route path="/actions_edit" element={<RequireAuth><PromotionsEdit /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <CompanyInfo variant="footer" />
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Денто-Гранд — стоматология для семьи</span>
            <Link to="/privacy" className="footer-link">Политика конфиденциальности</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
