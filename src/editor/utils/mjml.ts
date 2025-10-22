// src/editor/utils/mjml.ts
/**
 * Normalize MJML markup before handing it to GrapesJS.
 *
 * - Strips a UTF-8 BOM if present.
 * - Trims surrounding whitespace.
 * - Removes any leading content before the first <mjml> tag (eg. XML prolog).
 */
export const sanitizeMjmlMarkup = (markup: string): string => {
  const withoutBom = markup.replace(/^\uFEFF/, '');
  const mjmlIndex = withoutBom.toLowerCase().indexOf('<mjml');

  if (mjmlIndex === -1) {
    return withoutBom.trim();
  }

  return withoutBom.slice(mjmlIndex).trim();
};
