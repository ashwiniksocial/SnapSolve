/**
 * Backward-compatible reader for the existing revision planner localStorage key.
 *
 * The planner historically stored its question records as a flat object. Beta
 * readiness adds self-assessments to the same key in an envelope. Consumers that
 * need revision items only must accept both forms during the migration.
 */
export function unwrapRevisionItems<T>(stored: unknown): Record<string, T> {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};

  const record = stored as Record<string, unknown>;
  const items = record.items;
  if (items && typeof items === "object" && !Array.isArray(items)) {
    return items as Record<string, T>;
  }

  return record as Record<string, T>;
}