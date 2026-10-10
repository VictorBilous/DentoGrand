import { ABOUT_TEXT, GALLERY } from '../data/content.js';

export default function About() {
  return (
    <div className="container">
      <h1 className="page-title">О клинике</h1>
      <div className="prose">
        {ABOUT_TEXT.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <h2 className="section-title">Фотогалерея</h2>
      <div className="gallery">
        {GALLERY.map((g) => (
          <figure key={g.src}>
            <img src={g.src} alt={g.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </div>
  );
}
