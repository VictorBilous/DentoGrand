import { useCallback, useEffect, useRef, useState } from 'react';
import { api, fmtDate } from '../api.js';
import { useAuth } from '../auth.jsx';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const empty = () => ({ id: null, title: '', description: '', imageUrl: '', startDate: todayIso(), endDate: todayIso() });

function statusOf(p) {
  const t = todayIso();
  if (p.endDate < t) return 'завершена';
  if (p.startDate > t) return 'запланирована';
  return 'активна';
}

export default function PromotionsEdit() {
  const { logout } = useAuth();
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(empty());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);

  const handle = useCallback((e) => {
    if (e.status === 401) logout();
    else setError(e.message);
  }, [logout]);

  const load = useCallback(() => {
    api.getAllPromotions().then(setItems).catch(handle);
  }, [handle]);

  useEffect(load, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) { handle(err); }
    e.target.value = '';
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.endDate < form.startDate) return setError('Дата окончания не может быть раньше даты начала');
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl || null,
      startDate: form.startDate,
      endDate: form.endDate
    };
    try {
      if (form.id) await api.updatePromotion(form.id, payload);
      else await api.createPromotion(payload);
      setForm(empty());
      load();
    } catch (err) { handle(err); }
    finally { setBusy(false); }
  }

  function edit(p) {
    setForm({ ...p, imageUrl: p.imageUrl || '' });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function remove(p) {
    if (!window.confirm(`Удалить акцию «${p.title}»?`)) return;
    try {
      await api.deletePromotion(p.id);
      if (form.id === p.id) setForm(empty());
      load();
    } catch (err) { handle(err); }
  }

  return (
    <div className="container">
      <h1 className="page-title">Акции (ввод)</h1>

      <form className="card card-body form" onSubmit={submit} ref={formRef}>
        <h2 className="form-title">{form.id ? `Редактирование акции №${form.id}` : 'Новая акция'}</h2>

        <label className="field">
          <span>Название</span>
          <input value={form.title} onChange={set('title')} maxLength={200} required />
        </label>

        <div className="row">
          <label className="field">
            <span>Действует с</span>
            <input type="date" value={form.startDate} onChange={set('startDate')} required />
          </label>
          <label className="field">
            <span>Действует по</span>
            <input type="date" value={form.endDate} min={form.startDate} onChange={set('endDate')} required />
          </label>
        </div>

        <label className="field">
          <span>Описание</span>
          <textarea rows={4} value={form.description} onChange={set('description')} maxLength={3000} required />
        </label>

        <div className="field">
          <span>Фото</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} />
          {form.imageUrl && (
            <div className="preview">
              <img src={form.imageUrl} alt="Предпросмотр" />
              <button type="button" className="btn btn-small btn-outline" onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}>
                Убрать фото
              </button>
            </div>
          )}
        </div>

        {error && <p className="alert" role="alert">{error}</p>}

        <div className="row buttons">
          <button className="btn btn-primary" disabled={busy}>{form.id ? 'Сохранить изменения' : 'Добавить акцию'}</button>
          {form.id && <button type="button" className="btn btn-outline" onClick={() => setForm(empty())}>Отменить</button>}
        </div>
      </form>

      <h2 className="section-title">Все акции</h2>
      {!items && !error && <p className="status">Загружаем…</p>}
      {items && items.length === 0 && <p className="status">Акций пока нет. Добавьте первую.</p>}

      <div className="grid">
        {items?.map((p) => (
          <article className="card" key={p.id}>
            {p.imageUrl && <img className="card-img wide" src={p.imageUrl} alt="" loading="lazy" />}
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="muted-strong">{fmtDate(p.startDate)} — {fmtDate(p.endDate)} · {statusOf(p)}</p>
              <p className="pre">{p.description}</p>
              <div className="row buttons">
                <button type="button" className="btn btn-small btn-outline" onClick={() => edit(p)}>Изменить</button>
                <button type="button" className="btn btn-small btn-outline" onClick={() => remove(p)}>Удалить</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
