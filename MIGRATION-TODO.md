# Black Bunny Panel — React + Node Migration TODO

Branch: `feature/react-node-migration`

The existing CodeIgniter/PHP application remains untouched while each migration phase is implemented and verified.

## Phase 0 — Safety and baseline

- [x] Preserve the existing PHP application
- [x] Keep migration work on a separate branch
- [x] Add secret and build-output ignore rules
- [x] Add React/Vite frontend foundation
- [x] Add Node/Express backend foundation
- [x] Add Helmet, explicit CORS, rate limiting and JSON size limits
- [x] Add API health endpoint
- [x] Add API port validation
- [x] Add initial responsive dashboard shell
- [x] Add Three.js/React Three Fiber visual prototype
- [ ] Run frontend install, build and browser smoke test
- [ ] Run backend install and health-route smoke test

## Phase 1 — Behaviour mapping

- [x] Map CodeIgniter routes
- [x] Map authentication and registration flow
- [x] Map session expiry and account-status checks
- [x] Map Owner/Admin/User level behaviour
- [x] Map user and licence data models
- [ ] Record exact licence-generation rules and edge cases
- [ ] Record APK validation request/response contract
- [ ] Add a compatibility matrix for old and new routes

## Phase 2 — Secure identity and roles

- [ ] Add Node configuration validation with safe startup errors
- [ ] Add database adapter interface without committing credentials
- [ ] Add password verification compatible with the existing hash format
- [ ] Add secure login and logout endpoints
- [ ] Add short-lived access/session strategy
- [ ] Add server-side Owner/Admin/User permission middleware
- [ ] Add inactive/expired account enforcement
- [ ] Add validation, rate limits and audit-safe error responses
- [ ] Add authentication tests with dummy data only

## Phase 3 — Dashboard and navigation

- [ ] Add React routing and protected routes
- [ ] Add role-aware navigation
- [ ] Add login, register and session-expired screens
- [ ] Connect dashboard cards to API data
- [ ] Add loading, empty, error and retry states
- [ ] Add accessible motion preferences and keyboard navigation

## Phase 4 — Licence and APK APIs

- [ ] Add read-only licence listing with owner/admin scoping
- [ ] Add secure licence generation endpoint
- [ ] Add licence edit, reset, delete and bulk-action permissions
- [ ] Add APK validation endpoint compatible with the existing client
- [ ] Add device-limit and expiry handling
- [ ] Add request validation and idempotency for sensitive actions
- [ ] Add contract tests before switching any client traffic

## Phase 5 — User and referral management

- [ ] Add scoped user listing
- [ ] Add admin user-management permissions
- [ ] Add referral creation and redemption rules
- [ ] Add account status and expiry management
- [ ] Add audit events for privileged actions

## Phase 6 — Production-quality UI

- [ ] Add page transitions and action feedback
- [ ] Add 3D scenes only where performance is safe
- [ ] Add reduced-motion fallback
- [ ] Add responsive mobile layouts
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add consistent toast and form error system

## Phase 7 — Verification and rollout

- [ ] Run lint, type/build checks and backend tests
- [ ] Run security review for secrets, CORS, headers and authorization
- [ ] Run role-by-role smoke tests with dummy accounts
- [ ] Run licence compatibility tests against a test database
- [ ] Document environment variables and deployment steps
- [ ] Prepare migration rollback plan
- [ ] Produce final local preview checklist
- [ ] Ask for approval before production cutover

## Rules

- Never commit `.env`, passwords, signing keys, production database dumps or real customer/licence data.
- Never rely on frontend-only role hiding; every permission must be enforced by the backend.
- Do not remove or replace the PHP application until compatibility tests pass and rollback is documented.
