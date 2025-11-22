declare module 'grapesjs-rte-extensions' {
  import type { Editor } from 'grapesjs';

  type RteExtensionsFormat = {
    heading1?: boolean;
    heading2?: boolean;
    heading3?: boolean;
    heading4?: boolean;
    heading5?: boolean;
    paragraph?: boolean;
    quote?: boolean;
    clearFormatting?: boolean;
  };

  interface RteExtensionsOptions {
    list?: boolean;
    align?: boolean;
    indentOutdent?: boolean;
    format?: RteExtensionsFormat;
  }

  export default function rteExtensions(editor: Editor, options?: RteExtensionsOptions): void;
}
