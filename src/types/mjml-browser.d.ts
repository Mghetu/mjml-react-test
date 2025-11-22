declare module 'mjml-browser' {
  export interface MjmlError {
    formattedMessage?: string;
    message?: string;
    line?: number;
    tagName?: string;
  }

  export interface MjmlToHtmlOptions {
    validationLevel?: 'strict' | 'soft' | 'skip';
    minify?: boolean;
    beautify?: boolean;
    keepComments?: boolean;
  }

  export interface MjmlToHtmlResult {
    html: string;
    errors: MjmlError[];
  }

  export default function mjml2html(mjml: string, options?: MjmlToHtmlOptions): MjmlToHtmlResult;
}
