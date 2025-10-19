import type { ReactElement, SVGProps } from 'react';
import { memo } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function createIcon(paths: ReactElement) {
  function Icon({ size = 16, className, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        {paths}
      </svg>
    );
  }

  return memo(Icon);
}

export const Blocks = createIcon(
  <>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
  </>
);

export const Layers = createIcon(
  <>
    <path d="M12 5 4 9l8 4 8-4-8-4Z" />
    <path d="m4 13 8 4 8-4" />
    <path d="m4 17 8 4 8-4" />
  </>
);

export const Palette = createIcon(
  <>
    <path d="M12 4c-4.7 0-8 3.1-8 7 0 3.1 2.1 5.5 4.6 5.5H10 a 1 1 0 0 1 0 2 h -.3" />
    <path d="M14 18.5h2c2.5 0 4.5-2.4 4.5-5.5C20.5 7.1 16.7 4 12 4Z" />
    <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
  </>
);

export const SlidersHorizontal = createIcon(
  <>
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
    <circle cx="8" cy="8" r="2.5" />
    <circle cx="16" cy="16" r="2.5" />
  </>
);

export const Eye = createIcon(
  <>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOff = createIcon(
  <>
    <path d="M2.5 12s3.5-6 9.5-6c1.6 0 3 .4 4.2 1" />
    <path d="M21.5 12s-3.5 6-9.5 6c-1.6 0-3-.4-4.2-1" />
    <circle cx="12" cy="12" r="3" />
    <line x1="4" y1="4" x2="20" y2="20" />
  </>
);

export const Maximize2 = createIcon(
  <>
    <polyline points="7 7 7 4 4 4" />
    <line x1="7" y1="4" x2="4" y2="7" />
    <polyline points="17 17 17 20 20 20" />
    <line x1="17" y1="20" x2="20" y2="17" />
    <polyline points="17 7 20 7 20 4" />
    <line x1="20" y1="7" x2="17" y2="4" />
    <polyline points="7 17 4 17 4 20" />
    <line x1="4" y1="17" x2="7" y2="20" />
  </>
);

export const Code = createIcon(
  <>
    <polyline points="9 6 3 12 9 18" />
    <polyline points="15 6 21 12 15 18" />
  </>
);

export const Trash2 = createIcon(
  <>
    <path d="M6 7h12" />
    <path d="M9 4h6l1 3H8l1-3Z" />
    <path d="M9 10v7" />
    <path d="M12 10v7" />
    <path d="M15 10v7" />
    <rect x="6" y="7" width="12" height="13" rx="1.5" />
  </>
);

export const Undo2 = createIcon(
  <>
    <path d="M9 7H5V3" />
    <path d="M5 7c1.4-1.8 3.8-3 6.5-3C16 4 20 7.1 20 12s-4 8-8.5 8c-2.5 0-4.8-1-6.4-2.6" />
  </>
);

export const Redo2 = createIcon(
  <>
    <path d="M15 7h4V3" />
    <path d="M19 7c-1.4-1.8-3.8-3-6.5-3C8 4 4 7.1 4 12s4 8 8.5 8c2.5 0 4.8-1 6.4-2.6" />
  </>
);

export const Monitor = createIcon(
  <>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <line x1="8" y1="20" x2="16" y2="20" />
    <line x1="12" y1="16" x2="12" y2="20" />
  </>
);

export const Tablet = createIcon(
  <>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <circle cx="12" cy="18" r="0.7" fill="currentColor" stroke="none" />
  </>
);

export const Smartphone = createIcon(
  <>
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <circle cx="12" cy="18" r="0.7" fill="currentColor" stroke="none" />
  </>
);

export const Lock = createIcon(
  <>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15" r="1.5" />
  </>
);

export const Unlock = createIcon(
  <>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M16 10V7a4 4 0 0 0-8 0" />
    <circle cx="12" cy="15" r="1.5" />
  </>
);
