// This replaces Claude's window.storage API with localStorage
// All data is stored locally per browser — works for deployment
// For shared data across friends, swap this with Firebase (see comments below)

const storage = {
  async get(key: string, _shared?: boolean) {
    try {
      const val = localStorage.getItem(key);
      if (val === null) throw new Error("Not found");
      return { key, value: val, shared: !!_shared };
    } catch {
      return null;
    }
  },

  async set(key: string, value: string, _shared?: boolean) {
    try {
      localStorage.setItem(key, value);
      return { key, value, shared: !!_shared };
    } catch {
      return null;
    }
  },

  async delete(key: string, _shared?: boolean) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: !!_shared };
    } catch {
      return null;
    }
  },

  async list(prefix?: string, _shared?: boolean) {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (!prefix || k.startsWith(prefix))) keys.push(k);
    }
    return { keys, prefix, shared: !!_shared };
  }
};

// Install on window so the app can use window.storage
(window as any).storage = storage;

export default storage;

/*
 * ━━━ FIREBASE UPGRADE (for shared data between friends) ━━━
 * 
 * 1. Go to https://firebase.google.com → Create project "ucl-predictor"
 * 2. Add Firestore Database (start in test mode)
 * 3. Project Settings → Add Web App → copy config
 * 4. Replace the storage object above with:
 *
 * const FIREBASE_CONFIG = {
 *   apiKey: "YOUR_API_KEY",
 *   projectId: "YOUR_PROJECT_ID",
 * };
 * const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;
 * 
 * const storage = {
 *   async get(key, shared) {
 *     const res = await fetch(`${FIRESTORE_URL}/shared/${encodeURIComponent(key)}`);
 *     if (!res.ok) return null;
 *     const doc = await res.json();
 *     return { key, value: doc.fields?.value?.stringValue || null, shared };
 *   },
 *   async set(key, value, shared) {
 *     await fetch(`${FIRESTORE_URL}/shared/${encodeURIComponent(key)}`, {
 *       method: "PATCH",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ fields: { value: { stringValue: value } } })
 *     });
 *     return { key, value, shared };
 *   },
 *   async delete(key, shared) {
 *     await fetch(`${FIRESTORE_URL}/shared/${encodeURIComponent(key)}`, { method: "DELETE" });
 *     return { key, deleted: true, shared };
 *   },
 *   async list(prefix, shared) { return { keys: [], prefix, shared }; }
 * };
 */
