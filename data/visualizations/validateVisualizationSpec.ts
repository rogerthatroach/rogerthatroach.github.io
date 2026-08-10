type FigureSpec = {
  readonly id: string;
  readonly title: string;
  readonly caption: string;
  readonly headingLevel?: unknown;
};

type RelationshipCheck = {
  readonly name: string;
  readonly referencedIds: readonly string[];
  readonly targetIds: readonly string[];
};

type AuthoredArrayCheck = {
  readonly name: string;
  readonly values: readonly unknown[];
};

type VisualizationSpecValidationOptions = {
  /**
   * Empty arrays are rejected by default. List a path only when emptiness is a
   * meaningful authored state, rather than an omitted mobile composition.
   */
  readonly intentionalEmptyArrayPaths?: readonly string[];
  readonly relationships?: readonly RelationshipCheck[];
  readonly additionalAuthoredArrays?: readonly AuthoredArrayCheck[];
};

const VALID_HEADING_LEVELS = new Set([2, 3, 4]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function fail(figureId: string, message: string): never {
  throw new Error(`[visualization:${figureId}] ${message}`);
}

function childPath(path: string, value: unknown, index: number): string {
  if (isRecord(value) && isNonEmptyString(value.id)) {
    return `${path}[id=${value.id}]`;
  }

  return `${path}[${index}]`;
}

/**
 * Validates authored visualization data at module-import time and returns it
 * unchanged. Array order is never normalized: it is the authored mobile and
 * no-JavaScript reading order.
 *
 * Interaction and motion capabilities deliberately remain TypeScript and
 * component contracts. They are not inferred here and require no metadata in
 * otherwise static figure specifications.
 */
export function validateVisualizationSpec<T extends FigureSpec>(
  spec: T,
  options: VisualizationSpecValidationOptions = {},
): T {
  const figureId = isNonEmptyString(spec.id) ? spec.id : '<missing-id>';

  if (!isNonEmptyString(spec.id)) {
    fail(figureId, 'figure id must be a non-empty string');
  }
  if (!isNonEmptyString(spec.title)) {
    fail(figureId, 'figure title must be a non-empty string');
  }
  if (!isNonEmptyString(spec.caption)) {
    fail(figureId, 'figure caption must be a non-empty string');
  }
  if (spec.headingLevel !== undefined && !VALID_HEADING_LEVELS.has(spec.headingLevel as number)) {
    fail(figureId, `headingLevel must be 2, 3, or 4; received ${String(spec.headingLevel)}`);
  }

  const allowedEmptyPaths = new Set(options.intentionalEmptyArrayPaths ?? []);
  const observedEmptyPaths = new Set<string>();

  const visit = (value: unknown, path: string): void => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        if (!allowedEmptyPaths.has(path)) {
          fail(figureId, `${path} must contain an authored item`);
        }
        observedEmptyPaths.add(path);
        return;
      }

      const nestedIds = new Set<string>();
      value.forEach((item) => {
        if (!isRecord(item) || !('id' in item)) return;
        if (!isNonEmptyString(item.id)) {
          fail(figureId, `${path} contains an item with an empty id`);
        }
        if (nestedIds.has(item.id)) {
          fail(figureId, `${path} contains duplicate nested id "${item.id}"`);
        }
        nestedIds.add(item.id);
      });

      value.forEach((item, index) => visit(item, childPath(path, item, index)));
      return;
    }

    if (isRecord(value)) {
      Object.entries(value).forEach(([key, child]) => {
        visit(child, path ? `${path}.${key}` : key);
      });
    }
  };

  visit(spec, '');

  allowedEmptyPaths.forEach((path) => {
    if (!observedEmptyPaths.has(path)) {
      fail(figureId, `intentional empty-array exception does not match an empty array: ${path}`);
    }
  });

  options.additionalAuthoredArrays?.forEach(({ name, values }) => {
    if (values.length === 0) {
      fail(figureId, `${name} must contain an authored item`);
    }
    visit(values, name);
  });

  options.relationships?.forEach(({ name, referencedIds, targetIds }) => {
    if (referencedIds.length === 0) {
      fail(figureId, `${name} must reference at least one authored target`);
    }

    const targets = new Set(targetIds);
    referencedIds.forEach((referencedId) => {
      if (!isNonEmptyString(referencedId)) {
        fail(figureId, `${name} contains an empty relationship id`);
      }
      if (!targets.has(referencedId)) {
        fail(figureId, `${name} references missing target id "${referencedId}"`);
      }
    });
  });

  return spec;
}
