import mjmlModule from 'mjml';
import tinifyModule from 'tinify';

const mjml2html =
  typeof mjmlModule === 'function'
    ? mjmlModule
    : mjmlModule?.default;

const tinify =
  tinifyModule?.default && typeof tinifyModule.default === 'object'
    ? tinifyModule.default
    : tinifyModule;

const DATA_IMAGE_SRC_REGEX =
  /(<mj-image\b[^>]*\bsrc\s*=\s*)(["'])(data:image\/[^"']+)\2/gi;

const HTTP_IMAGE_SRC_REGEX =
  /(<mj-image\b[^>]*\bsrc\s*=\s*)(["'])(https?:\/\/[^"']+)\2/gi;

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body),
});

const getMimeTypeFromBuffer = (buffer) => {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
};

const optimizeDataUriWithTinify = async (dataUri) => {
  const commaIndex = dataUri.indexOf(',');
  if (commaIndex === -1) {
    return dataUri;
  }

  const metadata = dataUri.slice(0, commaIndex);
  const payload = dataUri.slice(commaIndex + 1);
  if (!/;base64/i.test(metadata)) {
    return dataUri;
  }

  const sourceBuffer = Buffer.from(payload, 'base64');
  const optimizedBuffer = await tinify.fromBuffer(sourceBuffer).toBuffer();
  const mimeTypeFromTinify = getMimeTypeFromBuffer(optimizedBuffer);
  const mimeTypeFromSource = (metadata.match(/^data:([^;]+)/i) || [])[1];
  const mimeType = mimeTypeFromTinify || mimeTypeFromSource || 'image/png';

  return `data:${mimeType};base64,${optimizedBuffer.toString('base64')}`;
};

const optimizeInlineImagesInMjml = async (mjml) => {
  const matches = [...mjml.matchAll(DATA_IMAGE_SRC_REGEX)];
  if (matches.length === 0) {
    return mjml;
  }

  const uniqueSources = Array.from(new Set(matches.map((match) => match[3])));
  const replacementMap = new Map();

  await Promise.all(
    uniqueSources.map(async (source) => {
      const optimized = await optimizeDataUriWithTinify(source);
      replacementMap.set(source, optimized);
    }),
  );

  return mjml.replace(DATA_IMAGE_SRC_REGEX, (fullMatch, prefix, quote, src) => {
    const replacement = replacementMap.get(src) || src;
    return `${prefix}${quote}${replacement}${quote}`;
  });
};

const optimizeHttpImagesInMjml = async (mjml) => {
  const matches = [...mjml.matchAll(HTTP_IMAGE_SRC_REGEX)];
  if (matches.length === 0) {
    return mjml;
  }

  const uniqueSources = Array.from(new Set(matches.map((match) => match[3])));
  const replacementMap = new Map();

  await Promise.all(
    uniqueSources.map(async (source) => {
      const optimizedUrl = await tinify.fromUrl(source).toDataUri();
      replacementMap.set(source, optimizedUrl);
    }),
  );

  return mjml.replace(HTTP_IMAGE_SRC_REGEX, (fullMatch, prefix, quote, src) => {
    const replacement = replacementMap.get(src) || src;
    return `${prefix}${quote}${replacement}${quote}`;
  });
};

export const handler = async (event) => {
  if (typeof mjml2html !== 'function') {
    return createResponse(500, {
      error: 'MJML converter failed to load in serverless runtime.',
    });
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method Not Allowed' });
  }

  const apiKey = process.env.TINIFY_API_KEY;
  if (!apiKey) {
    return createResponse(500, {
      error: 'Server is missing TINIFY_API_KEY.',
    });
  }
  tinify.key = apiKey;

  let requestPayload;
  try {
    requestPayload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return createResponse(400, { error: 'Invalid JSON payload.' });
  }

  const mjml = requestPayload?.mjml;
  if (typeof mjml !== 'string' || mjml.trim().length === 0) {
    return createResponse(400, { errors: ['MJML payload is required.'] });
  }

  let optimizedMjml = mjml;
  try {
    optimizedMjml = await optimizeInlineImagesInMjml(optimizedMjml);
  } catch (error) {
    console.error('Failed to optimize inline uploaded images:', error);
    return createResponse(502, {
      error: 'Image optimization failed for uploaded image assets.',
    });
  }

  const queryString =
    typeof event.rawQuery === 'string'
      ? event.rawQuery
      : typeof event.queryStringParameters === 'object' &&
          event.queryStringParameters !== null
        ? Object.entries(event.queryStringParameters)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
            .join('&')
        : '';
  const query = new URLSearchParams(queryString);
  if (query.get('optimizeRemoteImages') === '1') {
    try {
      optimizedMjml = await optimizeHttpImagesInMjml(optimizedMjml);
    } catch (error) {
      console.error('Failed to optimize remote image URLs:', error);
      return createResponse(502, {
        error: 'Image optimization failed for remote image URLs.',
      });
    }
  }

  let result;
  try {
    result = await Promise.resolve(
      mjml2html(optimizedMjml, {
        validationLevel: 'strict',
        minify: true,
        beautify: false,
        keepComments: false,
      }),
    );
  } catch (error) {
    console.error('MJML conversion runtime error:', error);
    return createResponse(500, {
      error: 'MJML conversion failed in serverless runtime.',
    });
  }

  if (!result || typeof result !== 'object') {
    return createResponse(500, {
      error: 'MJML conversion produced an invalid response shape.',
    });
  }

  const htmlOutput =
    typeof result.html === 'string' ? result.html : '';
  const resultErrors = Array.isArray(result.errors) ? result.errors : [];

  if (resultErrors.length > 0) {
    return createResponse(400, { errors: resultErrors });
  }

  if (!htmlOutput) {
    return createResponse(500, {
      error: 'MJML conversion completed without HTML output.',
    });
  }

  return createResponse(200, {
    html: htmlOutput,
    optimizedMjml,
  });
};
