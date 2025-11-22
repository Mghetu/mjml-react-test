// tests/convert-mjml.test.js
// Simple reproducibility harness for /api/convert-mjml 405 errors.
// Run with: node tests/convert-mjml.test.js
// Defaults to the expected dev server host: http://localhost:3001/api/convert-mjml
// You can override via the MJML_CONVERT_URL env var.

const endpoint = process.env.MJML_CONVERT_URL || 'http://localhost:3001/api/convert-mjml';
const sampleMjml = '<mjml><mj-body><mj-section><mj-column><mj-text>Test</mj-text></mj-column></mj-section></mj-body></mjml>';

async function testConvert() {
  console.log('Posting to', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mjml: sampleMjml }),
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    const body = await response.text();
    console.log('Body:', body);

    if (response.status === 405) {
      console.error('ERROR 405: Backend route exists but does not accept POST.');
    } else if (response.status !== 200) {
      console.error('ERROR: Unexpected status code received from backend.');
    }
  } catch (error) {
    console.error('ERROR: Request to /api/convert-mjml failed to complete.', error);
  }
}

try {
  await testConvert();
} catch (unhandledError) {
  console.error('Unhandled error while running the convert MJML test:', unhandledError);
}
