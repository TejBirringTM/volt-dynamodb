import z from 'zod';
import { CommonAttributeSchemas as Attr } from '@framework/schema';

export const AttributeNameSch = z.string().min(1).max(255).regex(/\S/);
export type AttributeName = z.infer<typeof AttributeNameSch>;

const keyAttributeTypeMap = {
  STRING: Attr.StringSch({ inclusiveMinLength: 1 /* char(s) */ }),
  NUMBER: Attr.NumberSch({}),
  BINARY: Attr.BinarySch({ inclusiveMinLength: 1 /* byte(s) */ }),
} as const;

export type KeyAttributeType = keyof typeof keyAttributeTypeMap;
export const KeyAttributeTypeSch = z.enum(Object.keys(keyAttributeTypeMap) as KeyAttributeType[]);

export const KeyAttributeSch = z.object({
  name: AttributeNameSch,
  type: KeyAttributeTypeSch,
});
export type KeyAttribute = z.infer<typeof KeyAttributeSch>;
