import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionStore } from '../src/auth/session.js';
import { createAuthService } from '../src/auth/service.js';

test('expires sessions after the configured TTL', () => {
  let currentTime = 0;
  const store = createSessionStore({ ttlSeconds: 5, now: () => currentTime });
  const created = store.create({ id: 1 });
  assert.equal(store.get(created.token).user.id, 1);
  currentTime = 5001;
  assert.equal(store.get(created.token), null);
});

test('rejects inactive users before password verification', async () => {
  const service = createAuthService({
    userRepository: { findByUsername: async () => ({ status: 0, level: 1 }) },
    sessionStore: createSessionStore(),
  });
  const result = await service.login({ username: 'testuser', password: 'password' });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'Invalid credentials or inactive account');
});
