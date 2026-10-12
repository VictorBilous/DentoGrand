import { useState } from 'react';
import BookingModal from '../components/BookingModal.jsx';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <section className="hero container">
      <img className="hero-logo" src="/img/logo.svg" alt="Логотип DentoGrand" width="150" height="150" />
      <h1 className="hero-title">Денто-Гранд</h1>
      <p className="hero-sub">Стоматологическая клиника для всей семьи</p>
      <button type="button" className="btn btn-primary btn-lg" onClick={() => setOpen(true)}>
        Записаться на приём
      </button>
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </section>
  );
}
