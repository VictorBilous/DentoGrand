const TOKEN_KEY = 'dentogrand_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = 'GET', body, form, auth = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined)
    });
  } catch {
    throw Object.assign(new Error('Нет связи с сервером. Проверьте подключение и повторите попытку.'), { status: 0 });
  }

  if (!res.ok) {
    let message = '';
    try {
      const data = await res.json();
      message =
        data.message ||
        (data.errors && Object.values(data.errors).flat().join(' ')) ||
        data.title ||
        '';
    } catch { /* ответ без JSON */ }
    throw Object.assign(new Error(message || `Ошибка сервера (${res.status})`), { status: res.status });
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (login, password) => request('/auth/login', { method: 'POST', body: { login, password } }),

  createAppointment: (data) => request('/appointments', { method: 'POST', body: data }),
  getAppointments: () => request('/appointments', { auth: true }),
  setRegistered: (id, isRegistered) =>
    request(`/appointments/${id}/registered`, { method: 'PATCH', body: { isRegistered }, auth: true }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE', auth: true }),

  getPromotions: () => request('/promotions'),
  getAllPromotions: () => request('/promotions/all', { auth: true }),
  createPromotion: (p) => request('/promotions', { method: 'POST', body: p, auth: true }),
  updatePromotion: (id, p) => request(`/promotions/${id}`, { method: 'PUT', body: p, auth: true }),
  deletePromotion: (id) => request(`/promotions/${id}`, { method: 'DELETE', auth: true }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/promotions/image', { method: 'POST', form, auth: true });
  }
};

/** "2026-10-01" -> "01.10.2026" */
export const fmtDate = (iso) => (iso ? iso.split('-').reverse().join('.') : '');
