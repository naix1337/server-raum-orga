const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unbekannter Fehler');
  return data;
}

export const api = {
  getDevices: (search) =>
    request(`/devices${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getDevice: (id) => request(`/devices/${encodeURIComponent(id)}`),

  createDevice: (body) => request('/devices', { method: 'POST', body: JSON.stringify(body) }),

  updateDevice: (id, body) =>
    request(`/devices/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) }),

  setStatus: (id, status) =>
    request(`/devices/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteDevice: (id) =>
    request(`/devices/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
