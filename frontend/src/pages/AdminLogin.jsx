import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function AdminLogin() {
  const { isAuth, login } = useAuth();
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuth) return <Navigate to="/records" replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(loginName.trim(), password);
      navigate('/records');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <h1 className="page-title">Вход для администратора</h1>
      <form className="card card-body form" onSubmit={submit}>
        <label className="field">
          <span>Логин</span>
          <input value={loginName} onChange={(e) => setLoginName(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label className="field">
          <span>Пароль</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button>
      </form>
    </div>
  );
}
