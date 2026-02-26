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

