export interface BulletSpacingChange {
  path: string;
  before: string;
  after: string;
}

export function normalizeBulletSpacingInString(value: string): string;

export function normalizeCustomizationBulletSpacing<T>(
  value: T,
  currentPath?: string,
): {
  value: T;
  changes: BulletSpacingChange[];
};
