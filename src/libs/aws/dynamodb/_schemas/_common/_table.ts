import { CommonAttributeSchemas as Attr, Optional } from '@/_framework_/schema';
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
 *
 */
export const TableIdSch = z.string().min(1);

/**
 *
 * See:
 *
 */
export const AmazonResourceNameSch = z.string().min(1);

/**
 *
 * See:
 *
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html#DDB-Type-StreamSpecification-StreamViewType
 */
export const TableStreamSpecificationSch = z.enum([
  'NONE',
  'KEYS_ONLY',
  'NEW_IMAGE',
  'OLD_IMAGE',
  'NEW_AND_OLD_IMAGES',
]);
export type TableStreamSpecification = z.infer<typeof TableStreamSpecificationSch>;

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
    maxReadRequestUnits: Optional(Attr.IntegerSch({ inclusiveMinValue: 1 })),
    maxWriteRequestUnits: Optional(Attr.IntegerSch({ inclusiveMinValue: 1 })),
  }),
  z.object({
    type: z.literal('PROVISIONED'),
    readCapacityUnits: Attr.IntegerSch({ inclusiveMinValue: 1 }),
    writeCapacityUnits: Attr.IntegerSch({ inclusiveMinValue: 1 }),
  }),
]);
export type TableBillingMode = z.infer<typeof TableBillingModeSch>;

/**
 *
 * See:
 *
 */
export const TableMultiRegionConsistencySch = z.enum(['EVENTUAL', 'STRONG']);
export type TableMultiRegionConsistency = z.infer<typeof TableMultiRegionConsistencySch>;

/**
 *
 * See:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/warm-throughput.html
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_WarmThroughput.html
 */
export const TableWarmThroughputSch = z.object({
  readUnitsPerSecond: Optional(Attr.IntegerSch({ inclusiveMinValue: 1 })),
  writeUnitsPerSecond: Optional(Attr.IntegerSch({ inclusiveMinValue: 1 })),
});
export type TableWarmThroughput = z.infer<typeof TableWarmThroughputSch>;
