import { DOCTORS } from '../data/content.js';

export default function Doctors() {
  return (
    <div className="container">
      <h1 className="page-title">Врачи</h1>
      <div className="grid">
        {DOCTORS.map((d) => (
          <article className="card" key={d.name}>
            {/* Две фотографии одного размера в одной позиции: вторая заменяет первую при наведении */}
            <div className="photo-swap" tabIndex={0}>
              <img className="photo-a" src={d.photo1} alt={d.name} loading="lazy" />
              <img className="photo-b" src={d.photo2} alt="" aria-hidden="true" loading="lazy" />
            </div>
            <div className="card-body">
              <h3>{d.name}</h3>
              <p className="muted-strong">{d.position}</p>
              <p>{d.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
