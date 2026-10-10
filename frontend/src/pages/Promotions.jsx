import { useEffect, useState } from 'react';
import { api, fmtDate } from '../api.js';

export default function Promotions() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPromotions().then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Акции</h1>

      {error && <p className="alert" role="alert">{error}</p>}
      {!items && !error && <p className="status">Загружаем акции…</p>}
      {items && items.length === 0 && <p className="status">Сейчас активных акций нет. Загляните позже.</p>}

      <div className="grid">
        {items?.map((p) => (
          <article className="card" key={p.id}>
            {p.imageUrl && <img className="card-img wide" src={p.imageUrl} alt="" loading="lazy" />}
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="muted-strong">Срок действия: с {fmtDate(p.startDate)} по {fmtDate(p.endDate)}</p>
              <p className="pre">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
