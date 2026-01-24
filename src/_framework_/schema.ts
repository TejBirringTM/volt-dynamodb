import z from 'zod';
import type { $ZodShape, $ZodType } from 'zod/v4/core';

export function declareSchema<
  SchemaKey extends string,
  SchemaVersion extends number,
  SchemaShape extends $ZodShape,
>(key: SchemaKey, version: SchemaVersion, shape: SchemaShape) {
  const schemaKey = `${key}/v${version}` as const;
  const schema = z.object({
    schemaId: z.literal(schemaKey),
    ...shape,
  });
  return schema;
}

export const Optional = <T extends $ZodType>(type: T) => z.nullish(type);

export * as CommonAttributeSchemas from './_common-attr-schemas';
