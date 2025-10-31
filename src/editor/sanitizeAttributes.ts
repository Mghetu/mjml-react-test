import type { Component } from 'grapesjs';

const ATTR_NAME_RE = /^[A-Za-z_:][A-Za-z0-9_\-:.]*$/;

function toPlainObject<T = unknown>(maybeObj: unknown): Record<string, T> {
  if (!maybeObj || typeof maybeObj !== 'object') {
    return {};
  }

  if (maybeObj instanceof Map) {
    return Object.fromEntries(
      Array.from(maybeObj.entries()).map(([key, value]) => [String(key), value as T])
    );
  }

  if (Array.isArray(maybeObj)) {
    const entries = maybeObj
      .filter((item): item is [unknown, unknown] => Array.isArray(item) && item.length === 2)
      .map(([key, value]) => [String(key), value as T]);

    return Object.fromEntries(entries);
  }

  return { ...(maybeObj as Record<string, T>) };
}

export function sanitizeComponentAttributes(component: Component) {
  const rawAttributes = component.getAttributes() as unknown;
  const needsNormalization =
    Array.isArray(rawAttributes) || rawAttributes instanceof Map || typeof rawAttributes !== 'object';
  const attributes = toPlainObject(rawAttributes);

  let dirty = false;
  const safeEntries: [string, unknown][] = [];

  for (const [name, value] of Object.entries(attributes)) {
    if (!ATTR_NAME_RE.test(name)) {
      dirty = true;
      continue;
    }

    if (value === undefined || value === null || value === '') {
      dirty = true;
      continue;
    }

    safeEntries.push([name, value]);
  }

  if (dirty || needsNormalization) {
    component.setAttributes(Object.fromEntries(safeEntries), { silent: true });
  }
}

function normalizeSpacingValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const joined = value
      .map((part) => String(part ?? '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    return joined || null;
  }

  if (value && typeof value === 'object') {
    const parts = Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => String((value as Record<string, unknown>)[key] ?? '').trim())
      .filter(Boolean);

    const joined = parts.join(' ').trim();
    return joined || null;
  }

  if (value !== undefined && value !== null) {
    const stringified = String(value).trim();
    return stringified || null;
  }

  return null;
}

export function sanitizeComponentStyles(component: Component) {
  const rawStyle = component.getStyle() as unknown;
  const styleObject = typeof rawStyle === 'string' ? {} : toPlainObject(rawStyle);
  const needsNormalization =
    typeof rawStyle === 'string' || Array.isArray(rawStyle) || rawStyle instanceof Map;

  let dirty = false;
  const safeStyle: Record<string, string> = {};

  for (const [name, value] of Object.entries(styleObject)) {
    if (name.trim() === '') {
      dirty = true;
      continue;
    }

    if (!Number.isNaN(Number(name))) {
      dirty = true;
      continue;
    }

    let normalized: string | null;

    if (name === 'padding' || name === 'margin') {
      normalized = normalizeSpacingValue(value);
    } else if (value === undefined || value === null) {
      normalized = null;
    } else {
      normalized = String(value).trim();
    }

    if (!normalized) {
      dirty = true;
      continue;
    }

    safeStyle[name] = normalized;
  }

  if (dirty || needsNormalization) {
    component.setStyle(safeStyle, { silent: true });
  }
}

export function deepSanitize(component: Component) {
  sanitizeComponentAttributes(component);
  sanitizeComponentStyles(component);

  const children = component.components();
  if (children && typeof children.forEach === 'function') {
    children.forEach((child: Component) => {
      deepSanitize(child);
    });
  }
}
