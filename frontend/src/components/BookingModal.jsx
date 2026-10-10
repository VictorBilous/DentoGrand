import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';

const PHONE_RE = /^\+?[0-9\s()\-]{6,20}$/;

export default function BookingModal({ onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Введите ваше имя';
    if (!form.phone.trim()) er.phone = 'Введите контактный телефон';
    else if (!PHONE_RE.test(form.phone.trim())) er.phone = 'Проверьте номер телефона';
    return er;
  }

  async function submit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    setServerError('');
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      await api.createAppointment({
        name: form.name.trim(),
        phone: form.phone.trim(),
        comment: form.comment.trim() || null
      });
      setDone(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" ref={dialogRef}>
        <button type="button" className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>

        {done ? (
          <div className="modal-done">
            <h2 id="booking-title">Заявка отправлена</h2>
            <p>Администратор клиники позвонит вам по номеру {form.phone} и подтвердит время приёма.</p>
            <button type="button" className="btn btn-primary" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id="booking-title">Записаться на приём</h2>

            <label className="field">
              <span>Ваше имя <b aria-hidden="true">*</b></span>
              <input value={form.name} onChange={set('name')} autoComplete="name" maxLength={100} required autoFocus
                aria-invalid={!!errors.name} />
              {errors.name && <em className="error">{errors.name}</em>}
            </label>

            <label className="field">
              <span>Контактный телефон <b aria-hidden="true">*</b></span>
              <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" maxLength={20}
                placeholder="+7 900 000-00-00" required aria-invalid={!!errors.phone} />
              {errors.phone && <em className="error">{errors.phone}</em>}
            </label>

            <label className="field">
              <span>Комментарии</span>
              <textarea rows={3} value={form.comment} onChange={set('comment')} maxLength={1000}
                placeholder="Например, удобное время или что вас беспокоит" />
            </label>

            {serverError && <p className="alert" role="alert">{serverError}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
              {sending ? 'Отправляем…' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
