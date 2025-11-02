export const CATEGORY = {
  MEM: 'MEM',
  ERDC: 'ERDC',
} as const;

export type CategoryValue = (typeof CATEGORY)[keyof typeof CATEGORY];
