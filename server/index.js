import express from 'express';
import mjml2html from 'mjml';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: '1mb' }));

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

app.use((error, _req, res, _next) => {
  console.error('MJML conversion server error:', error?.message ?? error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`MJML conversion server running on port ${port}`);
});
