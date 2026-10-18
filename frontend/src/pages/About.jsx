import { ABOUT, GALLERY } from '../data/content.js';
import CompanyInfo from '../components/CompanyInfo.jsx';

export default function About() {
  return (
    <div className="container">
      <h1 className="page-title">О клинике</h1>

      <div className="prose about-text">
        <h2 className="about-headline">{ABOUT.headline}</h2>
        <p>{ABOUT.intro}</p>

        <p className="about-list-title">{ABOUT.listTitle}</p>
        <ul>
          {ABOUT.items.map((i) => (
            <li key={i.lead}>
              <strong>{i.lead}</strong> {i.text}
            </li>
          ))}
        </ul>

        <p>
          <strong>{ABOUT.addressLabel}</strong> {ABOUT.address}
        </p>
        <p>{ABOUT.outro}</p>
      </div>

      <CompanyInfo />

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
