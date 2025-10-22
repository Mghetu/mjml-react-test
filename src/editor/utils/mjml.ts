// src/editor/utils/mjml.ts
/**
 * Normalize MJML markup before handing it to GrapesJS.
 *
 * - Strips a UTF-8 BOM if present.
 * - Trims surrounding whitespace.
 * - Removes any leading content before the first <mjml> tag (eg. XML prolog).
 * - Drops any trailing markup that appears after the closing </mjml> tag.
 */
export const sanitizeMjmlMarkup = (markup: string): string => {
  const withoutBom = markup.replace(/^\uFEFF/, '');
  const lowerCase = withoutBom.toLowerCase();
  const startIndex = lowerCase.indexOf('<mjml');

  if (startIndex === -1) {
    return withoutBom.trim();
  }

  const closingTag = '</mjml>';
  const endIndex = lowerCase.lastIndexOf(closingTag);
  const sliceEnd = endIndex === -1 ? withoutBom.length : endIndex + closingTag.length;

  return withoutBom.slice(startIndex, sliceEnd).trim();
};
