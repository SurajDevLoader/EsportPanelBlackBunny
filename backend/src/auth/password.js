import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';

const LEGACY_PREFIX = 'XquxmymXDtWRA66D';

export function legacyPasswordDigest(password) {
  return createHash('md5').update(`${LEGACY_PREFIX}${password}`, 'utf8').digest('hex');
}

export async function verifyLegacyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string' || !password || !storedHash) {
    return false;
  }
  const digest = legacyPasswordDigest(password);
  return bcrypt.compare(digest, storedHash);
}
