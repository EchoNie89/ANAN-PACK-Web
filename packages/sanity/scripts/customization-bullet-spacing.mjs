export function normalizeBulletSpacingInString(value) {
  return value.replace(/(^|\n)([ \t]*)•(?=\S)/g, "$1$2• ");
}

export function normalizeCustomizationBulletSpacing(value, currentPath = "") {
  if (typeof value === "string") {
    const normalized = normalizeBulletSpacingInString(value);

    return {
      value: normalized,
      changes:
        normalized === value
          ? []
          : [
              {
                path: currentPath,
                before: value,
                after: normalized,
              },
            ],
    };
  }

  if (Array.isArray(value)) {
    const nextItems = [];
    const changes = [];
    let changed = false;

    value.forEach((item, index) => {
      const result = normalizeCustomizationBulletSpacing(
        item,
        `${currentPath}[${index}]`,
      );

      nextItems.push(result.value);
      changes.push(...result.changes);
      changed = changed || result.changes.length > 0;
    });

    return {
      value: changed ? nextItems : value,
      changes,
    };
  }

  if (value && typeof value === "object") {
    const nextEntries = [];
    const changes = [];
    let changed = false;

    Object.entries(value).forEach(([key, nested]) => {
      const path = currentPath ? `${currentPath}.${key}` : key;
      const result = normalizeCustomizationBulletSpacing(nested, path);

      nextEntries.push([key, result.value]);
      changes.push(...result.changes);
      changed = changed || result.changes.length > 0;
    });

    return {
      value: changed ? Object.fromEntries(nextEntries) : value,
      changes,
    };
  }

  return {
    value,
    changes: [],
  };
}
