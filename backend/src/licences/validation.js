import { createHash } from 'node:crypto';
import { z } from 'zod';

const requestSchema = z.object({
  game: z.string().regex(/^[A-Za-z0-9_-]+$/).min(1),
  user_key: z.string().min(1).max(36),
  serial: z.string().regex(/^[A-Za-z0-9_-]+$/).min(1),
});

function isBefore(value, now) {
  return value ? new Date(value).getTime() > now() : false;
}

function addHours(date, hours) {
  return new Date(date + hours * 60 * 60 * 1000).toISOString();
}

export function createLicenceValidationService({ repository, staticWord, now = () => Date.now() }) {
  if (!repository || typeof repository.findByGameAndKey !== 'function') throw new TypeError('repository.findByGameAndKey is required');
  if (typeof repository.updateKey !== 'function') throw new TypeError('repository.updateKey is required');
  if (typeof staticWord !== 'string' || staticWord.length < 16) throw new TypeError('staticWord is required');

  return Object.freeze({
    async validate(input) {
      const { game, user_key: userKey, serial } = requestSchema.parse(input);
      const key = await repository.findByGameAndKey({ game, userKey });
      if (!key) return { status: false, reason: 'USER OR GAME NOT REGISTERED' };
      if (key.status !== 1) return { status: false, reason: 'USER BLOCKED' };

      let expiredDate = key.expired_date;
      if (!expiredDate) {
        expiredDate = addHours(now(), Number(key.duration));
        await repository.updateKey(key.id_keys, { expired_date: expiredDate });
      } else if (!isBefore(expiredDate, now)) {
        return { status: false, reason: 'EXPIRED KEY' };
      }

      const devices = String(key.devices || '').split(',').filter(Boolean);
      if (!devices.includes(serial)) {
        if (devices.length >= Number(key.max_devices)) return { status: false, reason: 'MAX DEVICE REACHED' };
        devices.push(serial);
        await repository.updateKey(key.id_keys, { devices: [...new Set(devices)].join(',') });
      }

      const real = `${game}-${userKey}-${serial}-${staticWord}`;
      const token = createHash('md5').update(real, 'utf8').digest('hex');
      return {
        status: true,
        data: { real, token, expired_date: expiredDate, EXP: expiredDate, exdate: expiredDate, device: Number(key.max_devices), rng: Math.floor(now() / 1000) },
      };
    },
  });
}
