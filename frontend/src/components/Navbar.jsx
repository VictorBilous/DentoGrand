import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const PUBLIC_LINKS = [
  { to: '/about', label: 'О клинике' },
  { to: '/doctors', label: 'Врачи' },
  { to: '/services', label: 'Услуги' },
  { to: '/actions', label: 'Акции' },
  { to: '/contacts', label: 'Контакты' }
];

const ADMIN_LINKS = [
  { to: '/records', label: 'Записи' },
  { to: '/actions_edit', label: 'Акции (ввод)' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuth, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [pathname]);

  const cls = (extra = '') => ({ isActive }) => `btn nav-btn ${extra} ${isActive ? 'is-active' : ''}`;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {pathname !== '/' ? (
          <Link to="/" className="brand" aria-label="DentoGrand — на главную">
            <img src="/img/logo.svg" alt="" width="34" height="34" />
            <span>DentoGrand</span>
          </Link>
        ) : (
          <span className="brand-spacer" />
        )}

        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav id="main-nav" className={`nav-links ${open ? 'open' : ''}`} aria-label="Основное меню">
          {PUBLIC_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls()}>{l.label}</NavLink>
          ))}
          {isAuth && ADMIN_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls('btn-orange')}>{l.label}</NavLink>
          ))}
          {isAuth && (
            <button
              type="button"
              className="btn nav-btn btn-orange btn-outline"
              onClick={() => { logout(); navigate('/'); }}
            >
              Выход
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
