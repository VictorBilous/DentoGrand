import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });

export default function Records() {
  const { logout } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  const handle = useCallback((e) => {
    if (e.status === 401) logout();
    else setError(e.message);
  }, [logout]);

  const load = useCallback(() => {
    setError('');
    api.getAppointments().then(setItems).catch(handle);
  }, [handle]);

  useEffect(load, [load]);

  async function toggle(a) {
    try {
      const upd = await api.setRegistered(a.id, !a.isRegistered);
      setItems((list) => list.map((x) => (x.id === a.id ? upd : x)));
    } catch (e) { handle(e); }
  }

  async function remove(a) {
    if (!window.confirm(`Удалить запись №${a.id} (${a.name})?`)) return;
    try {
      await api.deleteAppointment(a.id);
      setItems((list) => list.filter((x) => x.id !== a.id));
    } catch (e) { handle(e); }
  }

  const fresh = items?.filter((a) => !a.isRegistered).length ?? 0;

  return (
    <div className="container">
      <h1 className="page-title">Записи</h1>
      {error && <p className="alert" role="alert">{error}</p>}
      {!items && !error && <p className="status">Загружаем записи…</p>}
      {items && items.length === 0 && <p className="status">Заявок пока нет.</p>}

      {items && items.length > 0 && (
        <>
          <p className="status">Всего: {items.length}, ждут регистрации: {fresh}</p>
          <div className="table-wrap">
            <table className="records">
              <thead>
                <tr>
                  <th>№</th><th>Создана</th><th>Имя</th><th>Телефон</th><th>Комментарии</th><th>Зарегистрирована</th><th />
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className={a.isRegistered ? 'done' : ''}>
                    <td data-label="№">{a.id}</td>
                    <td data-label="Создана">{fmtDateTime(a.createdAt)}</td>
                    <td data-label="Имя">{a.name}</td>
                    <td data-label="Телефон"><a href={`tel:${a.phone.replace(/[^\d+]/g, '')}`}>{a.phone}</a></td>
                    <td data-label="Комментарии" className="pre">{a.comment || '—'}</td>
                    <td data-label="Зарегистрирована">
                      <button type="button" className={`btn btn-small ${a.isRegistered ? 'btn-ok' : 'btn-outline'}`}
                        onClick={() => toggle(a)} aria-pressed={a.isRegistered}>
                        {a.isRegistered ? 'Да' : 'Нет'}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button type="button" className="btn btn-small btn-outline" onClick={() => remove(a)}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
