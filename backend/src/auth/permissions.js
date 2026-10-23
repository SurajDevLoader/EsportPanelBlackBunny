export const ROLES = Object.freeze({
  OWNER: 'owner',
  ADMIN: 'admin',
  USER: 'user',
});

const permissionMatrix = Object.freeze({
  [ROLES.OWNER]: Object.freeze([
    'dashboard:read',
    'licences:read',
    'licences:create',
    'licences:update',
    'licences:delete',
    'users:read',
    'users:manage',
    'referrals:manage',
    'security:manage',
  ]),
  [ROLES.ADMIN]: Object.freeze([
    'dashboard:read',
    'licences:read',
    'licences:create',
    'licences:update',
    'licences:delete',
    'users:read',
    'users:manage',
    'referrals:manage',
  ]),
  [ROLES.USER]: Object.freeze([
    'dashboard:read',
    'licences:read',
  ]),
});

export function normalizeRole(role) {
  if (role === 1 || role === '1') return ROLES.ADMIN;
  if (role === 2 || role === '2' || role === 3 || role === '3') return ROLES.USER;
  if (typeof role === 'string' && Object.values(ROLES).includes(role.toLowerCase())) return role.toLowerCase();
  return null;
}

export function can(role, permission) {
  const normalizedRole = normalizeRole(role);
  return Boolean(normalizedRole && permissionMatrix[normalizedRole]?.includes(permission));
}

export function permissionsFor(role) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole ? [...permissionMatrix[normalizedRole]] : [];
}

export function requirePermission(permission) {
  return (request, response, next) => {
    if (!can(request.user?.role, permission)) {
      return response.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}
