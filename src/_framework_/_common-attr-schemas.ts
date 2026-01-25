import z from 'zod';
import { Optional } from './schema';

export type NumericAttributeSchemaArgs<T extends number | bigint> = {
  inclusiveMinValue?: T;
  inclusiveMaxValue?: T;
};

export const NumberSch = ({
  inclusiveMinValue,
  inclusiveMaxValue,
}: NumericAttributeSchemaArgs<number>) => {
  const schema = z.number();
  if (inclusiveMinValue) {
    schema.gte(inclusiveMinValue);
  }
  if (inclusiveMaxValue) {
    schema.gte(inclusiveMaxValue);
  }
};

export const IntegerSch = ({
  inclusiveMinValue,
  inclusiveMaxValue,
}: NumericAttributeSchemaArgs<bigint>) => {
  const schema = z.bigint();
  if (inclusiveMinValue) {
    schema.gte(inclusiveMinValue);
  }
  if (inclusiveMaxValue) {
    schema.lte(inclusiveMaxValue);
  }
  return schema;
};

export type StringAttributeSchemaArgs = {
  inclusiveMinLength?: number; // of chars
  inclusiveMaxLength?: number; // of chars
};

export const StringSch = ({
  inclusiveMinLength,
  inclusiveMaxLength,
}: StringAttributeSchemaArgs) => {
  const schema = z.string();
  if (inclusiveMinLength) {
    schema.min(inclusiveMinLength);
  }
  if (inclusiveMaxLength) {
    schema.max(inclusiveMaxLength);
  }
  return schema;
};

export type BinaryAttributeSchemaArgs = {
  inclusiveMinLength?: number; // of bytes
  inclusiveMaxLength?: number; // of bytes
};

export const BinarySch = ({
  inclusiveMinLength,
  inclusiveMaxLength,
}: BinaryAttributeSchemaArgs) => {
  const schema = z.base64();
  const toBase64Length = (nBytes: number): number => Math.ceil(nBytes * 4); // because 1 byte = 8 bits => 12 bits needed in base64 sequence = 4 base64 chars
  if (inclusiveMinLength) {
    schema.min(toBase64Length(inclusiveMinLength));
  }
  if (inclusiveMaxLength) {
    schema.max(toBase64Length(inclusiveMaxLength));
  }
  return schema;
};

export type StringDictionaryAttributeSchemaArgs<Key extends string> = string extends Key
  ? {
      keys?: Optional<Key[]>;
    }
  : {
      keys: Optional<Key[]>;
    };

export function StringDictionarySch<Key extends string>({
  keys,
}: StringDictionaryAttributeSchemaArgs<Key>): string extends Key
  ? z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodNullable<z.ZodString>>>
  : z.ZodRecord<z.ZodEnum<{ [K in Key]: K }>, z.ZodOptional<z.ZodNullable<z.ZodString>>> {
  const valueSchema = Optional(StringSch({ inclusiveMinLength: 1 }));

  if (keys) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return z.record(z.enum(keys as [Key, ...Key[]]), valueSchema) as any;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return z.record(StringSch({ inclusiveMinLength: 1 }), valueSchema) as any;
  }
}
