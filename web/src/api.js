const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// availability: { name, available, normalized }
export const checkAvailability = (name) => get(`/availability?name=${encodeURIComponent(name)}`);

// explore: { items: [...], total, page }
export const explore = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return get(`/explore${q ? `?${q}` : ''}`);
};

// full agent record
export const getAgent = (name) => get(`/agent/${encodeURIComponent(name)}`);

export const hostedManifestUrl = (name) => `${location.origin}/api/hosted/${encodeURIComponent(name)}.json`;
export const saveHostedProfile = (name, payload) => post(`/hosted/${encodeURIComponent(name)}`, payload);

// forward / reverse resolution
export const resolve = (name) => get(`/resolve/${encodeURIComponent(name)}`);
export const reverse = (wallet) => get(`/reverse/${encodeURIComponent(wallet)}`);
export const namesOf = (wallet) => get(`/names/${encodeURIComponent(wallet)}`);

// network stats: { total, online, registrations24h }
export const getStats = () => get('/stats');

// activity feed
export const getActivity = (limit = 40) => get(`/activity?limit=${limit}`);

// signed heartbeat ping from an agent owner
export const sendHeartbeat = (payload) => post('/heartbeat', payload);
