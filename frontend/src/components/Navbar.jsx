import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { CONTACTS } from '../data/content.js';
import { useBooking } from './BookingProvider.jsx';
import { ClockIcon, PhoneIcon, PinIcon } from './Icons.jsx';

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

// «10:00 – 21:00» -> «10:00–21:00»
const HOURS = (CONTACTS.hours?.[0]?.[1] ?? '10:00 – 21:00').replace(/\s+/g, '');
const MAP_URL = `https://yandex.ru/maps/?ll=${CONTACTS.lon}%2C${CONTACTS.lat}&z=16&pt=${CONTACTS.lon}%2C${CONTACTS.lat}&l=map`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuth, logout } = useAuth();
  const { openBooking } = useBooking();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const cls = (extra = '') => ({ isActive }) => `btn nav-btn ${extra} ${isActive ? 'is-active' : ''}`;

  return (
    <header className="navbar">
      {/* Медленно плывущие облака на фоне шапки */}
      <div className="header-clouds" aria-hidden="true" />

      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-info">
            <span className="tb-item tb-hours">
              <ClockIcon className="tb-icon" />
              <span className="tb-text">
                <span className="tb-hide">Время работы </span>
                {HOURS}
              </span>
            </span>

            <a
              className="tb-item tb-link tb-address"
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Адрес на Яндекс.Картах: ${CONTACTS.address}`}
              title={CONTACTS.address}
            >
              <PinIcon className="tb-icon" />
              <span className="tb-text tb-hide">{CONTACTS.address}</span>
            </a>

            <a
              className="tb-item tb-link tb-phone"
              href={`tel:${CONTACTS.phoneHref1}`}
              aria-label={`Позвонить: ${CONTACTS.phone1}`}
              title={CONTACTS.phone1}
            >
              <PhoneIcon className="tb-icon" />
              <span className="tb-text tb-hide">{CONTACTS.phone1}</span>
            </a>
          </div>
          <button type="button"
                      className="btn btn-primary btn-small topbar-cta" onClick={openBooking}>
            Записаться на приём
          </button>
        </div>
      </div>

      <div className="container navbar-inner">
        {pathname !== '/' ? (
          <Link to="/" className="brand" aria-label="Денто-Гранд — на главную">
            <img src="/img/logo.svg" alt="" width="34" height="34" />
            <span>Денто-Гранд</span>
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
