// Shared storage via Firestore REST API through /api/db
// All friends see the same data — predictions, matches, scores

const storage = {
  async get(key: string, _shared?: boolean) {
    try {
      const res = await fetch(`/api/db?key=${encodeURIComponent(key)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.value ? { key, value: data.value, shared: true } : null;
    } catch {
      // Fallback to localStorage if API fails
      const val = localStorage.getItem(key);
      return val ? { key, value: val, shared: false } : null;
    }
  },

  async set(key: string, value: string, _shared?: boolean) {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', key, value })
      });
      // Also save locally as backup
      localStorage.setItem(key, value);
      return { key, value, shared: true };
    } catch {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
  },

  async delete(key: string, _shared?: boolean) {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', key })
      });
      localStorage.removeItem(key);
      return { key, deleted: true, shared: true };
    } catch {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    }
  }
};

(window as any).storage = storage;
export default storage;