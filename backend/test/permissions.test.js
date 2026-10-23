import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLES, can, normalizeRole, permissionsFor } from '../src/auth/permissions.js';

test('normalizes legacy numeric levels', () => {
  assert.equal(normalizeRole(1), ROLES.ADMIN);
  assert.equal(normalizeRole(2), ROLES.USER);
  assert.equal(normalizeRole('owner'), ROLES.OWNER);
  assert.equal(normalizeRole('unknown'), null);
});

test('enforces role-specific permissions', () => {
  assert.equal(can(ROLES.OWNER, 'security:manage'), true);
  assert.equal(can(ROLES.ADMIN, 'security:manage'), false);
  assert.equal(can(ROLES.USER, 'licences:read'), true);
  assert.equal(can(ROLES.USER, 'licences:create'), false);
});

test('returns a defensive permission list', () => {
  const permissions = permissionsFor(ROLES.ADMIN);
  permissions.push('security:manage');
  assert.equal(can(ROLES.ADMIN, 'security:manage'), false);
});
