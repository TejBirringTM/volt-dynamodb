import { CommonAttributeSchemas as Attr, declareSchema, Optional } from '@/_framework_/schema';
import { KeyAttributeRequirementSch } from './_attribute';
import z from 'zod';

/**
 *
 * See:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.NamingRules
 */
export const TableNameSch = z
  .string()
  .min(3)
  .max(255)
  .regex(/[a-zA-Z0-9\-_.]/);
export type TableName = z.infer<typeof TableNameSch>;

/**
 *
 * See:
 */
export const TableClassSch = z.enum(['STANDARD', 'STANDARD_INFREQUENT_ACCESS']);
export type TableClass = z.infer<typeof TableClassSch>;

/**
 *
 * See:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html
 */
export const TableBillingModeSch = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PAY_PER_REQUEST'),
    maxReadRequestUnits: Optional(Attr.IntegerSch({ inclusiveMinValue: 1n })),
    maxWriteRequestUnits: Optional(Attr.IntegerSch({ inclusiveMinValue: 1n })),
  }),
  z.object({
    type: z.literal('PROVISIONED'),
    readCapacityUnits: Attr.IntegerSch({ inclusiveMinValue: 1n }),
    writeCapacityUnits: Attr.IntegerSch({ inclusiveMinValue: 1n }),
  }),
]);
export type TableBillingMode = z.infer<typeof TableBillingModeSch>;

/**
 *
 * See:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/warm-throughput.html
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_WarmThroughput.html
 */
export const TableWarmThroughputRequirementSch = z.object({
  readUnitsPerSecond: Optional(Attr.IntegerSch({ inclusiveMinValue: 1n })),
  writeUnitsPerSecond: Optional(Attr.IntegerSch({ inclusiveMinValue: 1n })),
});
export type TableWarmThroughputRequirement = z.infer<typeof TableWarmThroughputRequirementSch>;

/**
 *
 * See:
 *
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html#DDB-Type-StreamSpecification-StreamViewType
 */
export const TableStreamingRequirementSch = z.enum([
  'NONE',
  'KEYS_ONLY',
  'NEW_IMAGE',
  'OLD_IMAGE',
  'NEW_AND_OLD_IMAGES',
]);
export type TableStreamingRequirement = z.infer<typeof TableStreamingRequirementSch>;

/**
 *
 * See:
 */
export const TableRequirementSch = declareSchema('TableRequirement', 0, {
  name: TableNameSch,
  class: TableClassSch,
  billingMode: TableBillingModeSch,
  warmThroughputRequirement: Optional(TableWarmThroughputRequirementSch),
  streamingRequirement: Optional(TableStreamingRequirementSch),
  partitionKey: KeyAttributeRequirementSch,
  sortKey: Optional(KeyAttributeRequirementSch),
  tags: Optional(Attr.StringDictionarySch({})),
});
export type TableRequirement = z.infer<typeof TableRequirementSch>;
