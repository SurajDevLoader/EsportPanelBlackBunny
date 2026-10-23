import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { createSessionStore } from './auth/session.js';
import { createAuthService } from './auth/service.js';
import { createLicenceValidationService } from './licences/validation.js';

const app = express();
const sessionStore = createSessionStore({ ttlSeconds: config.sessionTtlSeconds });
const userRepository = { async findByUsername() { return null; } };
const authService = createAuthService({ userRepository, sessionStore });
const licenceService = createLicenceValidationService({
  staticWord: process.env.LICENCE_STATIC_WORD || 'development-static-word-1234',
  repository: {
    async findByGameAndKey() { return null; },
    async updateKey() { return undefined; },
  },
});

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'black-bunny-api' }));

app.post('/api/auth/login', async (request, response) => {
  try {
    const result = await authService.login(request.body);
    if (!result.ok) return response.status(401).json({ error: result.error });
    return response.json(result);
  } catch (error) {
    if (error.name === 'ZodError') return response.status(400).json({ error: 'Invalid login payload' });
    return response.status(500).json({ error: 'Authentication unavailable' });
  }
});

app.post('/api/auth/logout', (request, response) => {
  const token = request.get('authorization')?.replace(/^Bearer\s+/i, '');
  sessionStore.revoke(token);
  return response.status(204).send();
});

app.post('/api/connect', async (request, response) => {
  try {
    return response.json(await licenceService.validate(request.body));
  } catch (error) {
    if (error.name === 'ZodError') return response.status(400).json({ status: false, reason: 'Bad Parameter' });
    return response.status(500).json({ status: false, reason: 'Validation unavailable' });
  }
});

app.use((_request, response) => response.status(404).json({ error: 'Not found' }));
app.listen(config.port, () => console.log(`Black Bunny API listening on port ${config.port}`));
