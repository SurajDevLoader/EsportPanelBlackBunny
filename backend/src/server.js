import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { createSessionStore } from './auth/session.js';
import { createAuthService } from './auth/service.js';

const app = express();
const sessionStore = createSessionStore({ ttlSeconds: config.sessionTtlSeconds });

// The adapter is intentionally dependency-injected. Connect it to the test/staging
// database only after its schema and credentials are configured outside Git.
const userRepository = {
  async findByUsername() {
    return null;
  },
};
const authService = createAuthService({ userRepository, sessionStore });

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'black-bunny-api' });
});

app.post('/api/auth/login', async (request, response) => {
  try {
    const result = await authService.login(request.body);
    if (!result.ok) return response.status(401).json({ error: result.error });
    return response.json(result);
  } catch (error) {
    if (error.name === 'ZodError') return response.status(400).json({ error: 'Invalid login payload' });
    request.log?.error?.(error);
    return response.status(500).json({ error: 'Authentication unavailable' });
  }
});

app.post('/api/auth/logout', (request, response) => {
  const token = request.get('authorization')?.replace(/^Bearer\s+/i, '');
  sessionStore.revoke(token);
  return response.status(204).send();
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

app.listen(config.port, () => {
  console.log(`Black Bunny API listening on port ${config.port}`);
});
