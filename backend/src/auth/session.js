import { randomBytes } from 'node:crypto';

export function createSessionStore({ ttlSeconds = 1800, now = () => Date.now() } = {}) {
  const sessions = new Map();

  function purgeExpired() {
    const currentTime = now();
    for (const [token, session] of sessions) {
      if (session.expiresAt <= currentTime) sessions.delete(token);
    }
  }

  return Object.freeze({
    create(user) {
      purgeExpired();
      const token = randomBytes(32).toString('base64url');
      const expiresAt = now() + ttlSeconds * 1000;
      sessions.set(token, { user, expiresAt });
      return { token, expiresAt };
    },
    get(token) {
      if (!token) return null;
      purgeExpired();
      const session = sessions.get(token);
      return session ? { ...session } : null;
    },
    revoke(token) {
      return Boolean(token && sessions.delete(token));
    },
    size() {
      purgeExpired();
      return sessions.size;
    },
  });
}
