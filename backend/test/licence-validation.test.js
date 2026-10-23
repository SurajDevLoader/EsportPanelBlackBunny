import test from 'node:test';
import assert from 'node:assert/strict';
import { createLicenceValidationService } from '../src/licences/validation.js';

function serviceWith(key, updates = []) {
  return createLicenceValidationService({
    staticWord: 'test-static-word-1234',
    now: () => Date.parse('2026-01-01T00:00:00.000Z'),
    repository: {
      async findByGameAndKey() { return key; },
      async updateKey(id, patch) { updates.push({ id, patch }); },
    },
  });
}

test('rejects invalid request parameters', async () => {
  await assert.rejects(() => serviceWith(null).validate({ game: 'bad game', user_key: 'key', serial: 'device' }));
});

test('adds a device and returns a deterministic token', async () => {
  const updates = [];
  const result = await serviceWith({ id_keys: 7, status: 1, duration: 24, expired_date: null, max_devices: 2, devices: '' }, updates)
    .validate({ game: 'demo', user_key: 'ABC', serial: 'DEVICE-1' });
  assert.equal(result.status, true);
  assert.match(result.data.token, /^[a-f0-9]{32}$/);
  assert.equal(updates.length, 2);
});

test('rejects expired keys and full device slots', async () => {
  const expired = await serviceWith({ status: 1, expired_date: '2025-12-31T23:59:59.000Z', max_devices: 2, devices: '' })
    .validate({ game: 'demo', user_key: 'ABC', serial: 'DEVICE-1' });
  assert.deepEqual(expired, { status: false, reason: 'EXPIRED KEY' });

  const full = await serviceWith({ status: 1, expired_date: '2026-01-02T00:00:00.000Z', max_devices: 1, devices: 'DEVICE-0' })
    .validate({ game: 'demo', user_key: 'ABC', serial: 'DEVICE-1' });
  assert.deepEqual(full, { status: false, reason: 'MAX DEVICE REACHED' });
});
