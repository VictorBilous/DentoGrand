import { SERVICES } from '../data/content.js';

export default function Services() {
  return (
    <div className="container">
      <h1 className="page-title">Услуги</h1>
      <div className="grid">
        {SERVICES.map((s) => (
          <article className="card" key={s.name}>
            <img className="card-img wide" src={s.photo} alt="" loading="lazy" />
            <div className="card-body">
              <h3>{s.name}</h3>
              <p>{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
