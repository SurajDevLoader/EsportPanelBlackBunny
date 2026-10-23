import { z } from 'zod';
import { verifyLegacyPassword } from './password.js';
import { normalizeRole, permissionsFor } from './permissions.js';

const loginSchema = z.object({
  username: z.string().trim().min(4).max(25),
  password: z.string().min(6).max(128),
});

function isExpired(expirationDate, now) {
  if (!expirationDate) return false;
  const timestamp = new Date(expirationDate).getTime();
  return !Number.isFinite(timestamp) || timestamp <= now();
}

export function createAuthService({ userRepository, sessionStore, now = () => Date.now() }) {
  if (!userRepository || typeof userRepository.findByUsername !== 'function') {
    throw new TypeError('userRepository.findByUsername is required');
  }
  if (!sessionStore || typeof sessionStore.create !== 'function') {
    throw new TypeError('sessionStore.create is required');
  }

  return Object.freeze({
    async login(input) {
      const { username, password } = loginSchema.parse(input);
      const user = await userRepository.findByUsername(username);
      const valid = user && user.status === 1 && !isExpired(user.expiration_date, now)
        ? await verifyLegacyPassword(password, user.password)
        : false;
      if (!valid) return { ok: false, error: 'Invalid credentials or inactive account' };

      const role = normalizeRole(user.level);
      if (!role) return { ok: false, error: 'Invalid account role' };
      const session = sessionStore.create({
        id: user.id_users,
        username: user.username,
        role,
        permissions: permissionsFor(role),
      });
      return { ok: true, session };
    },
  });
}
