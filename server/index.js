import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mjml2html from 'mjml';

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

app.use(express.json({ limit: '1mb' }));

// Lightweight request logging for the MJML endpoint (no payloads persisted).
app.use('/api/convert-mjml', (req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const elapsed = Date.now() - startedAt;
    console.info(
      `[MJML] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`,
    );
  });

  next();
});

// Allow preflight requests for JSON POSTs without exposing MJML payloads.
app.options('/api/convert-mjml', (_req, res) => {
  res.sendStatus(204);
});

app.post('/api/convert-mjml', (req, res) => {
  const { mjml } = req.body ?? {};

  if (typeof mjml !== 'string' || mjml.trim().length === 0) {
    res.status(400).json({ errors: ['MJML payload is required.'] });
    return;
  }

  const result = mjml2html(mjml, {
    validationLevel: 'strict',
    minify: true,
    beautify: false,
    keepComments: false,
  });

  if (Array.isArray(result.errors) && result.errors.length > 0) {
    res.status(400).json({ errors: result.errors });
    return;
  }

  res.json({ html: result.html });
});

app.all('/api/convert-mjml', (_req, res) => {
  res.status(405).json({ error: 'Method Not Allowed' });
});

// If the production build exists, serve it so the API and client share the same origin.
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error('MJML conversion server error:', error?.message ?? error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`MJML conversion server running on port ${port}`);
});
