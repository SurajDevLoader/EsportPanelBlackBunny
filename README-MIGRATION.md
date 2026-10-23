# Black Bunny Panel migration

The legacy CodeIgniter application remains untouched while the new React + Node.js foundation is built in parallel.

## Run locally

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The API exposes `GET /api/health`. Real credentials, production database dumps, signing keys, and licence/customer data must not be committed.

## Security baseline

- Helmet security headers
- Explicit CORS origin
- JSON body-size limit
- Rate limiting
- Environment-based configuration
- Backend authorization will be added before licence-management routes are migrated

## Planned migration order

1. Authentication and session strategy
2. Owner/Admin/User authorization matrix
3. Dashboard and settings
4. Licence/key generation and validation APIs
5. Admin user and referral management
6. 3D visual layer and motion polish
