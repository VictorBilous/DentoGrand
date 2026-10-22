import { useBooking } from '../components/BookingProvider.jsx';

export default function Home() {
  const { openBooking } = useBooking();

  return (
    <section className="hero container">
      <img className="hero-logo" src="/img/logo.svg" alt="Логотип Денто-Гранд" width="150" height="150" />
      <h1 className="hero-title">Денто-Гранд</h1>
      <p className="hero-sub">стоматология для семьи</p>
      <button type="button" className="btn btn-primary btn-lg" onClick={openBooking}>
        Записаться на приём
      </button>
    </section>
  );
}
