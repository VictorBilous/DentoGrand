import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, getToken, setToken } from './api.js';

const AuthContext = createContext(null);

function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    const t = getToken();
    if (t && !isExpired(t)) return t;
    setToken(null);
    return null;
  });

  const login = useCallback(async (loginName, password) => {
    const res = await api.login(loginName, password);
    setToken(res.token);
    setTokenState(res.token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
  }, []);

  const value = useMemo(() => ({ isAuth: !!token, login, logout }), [token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
