import { BooleanSch, IntegerSch, StringTimestampSch } from '@/_framework_/_common-attr-schemas';
import { declareSchema, Optional } from '@/_framework_/schema';
import z from 'zod';
import {
  TableIdSch,
  TableNameSch,
  AmazonResourceNameSch,
  TableClassSch,
  TableStreamSpecificationSch,
  TableBillingModeSch,
  // TableMultiRegionConsistencySch,
  TableWarmThroughputSch,
  TableStatusSch,
} from '../_common/_table';
import { localIndexDescriptionSch } from './_local-index';
import { globalIndexDescriptionSch } from './_global-index';
import { KeyAttributeSch } from '../_common/_attribute';

/**
 *
 *
 * See:
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-dynamodb/Interface/TableDescription/
 */
export const TableDescriptionSch = declareSchema('TableDescription', 0, {
  name: TableNameSch,
  id: TableIdSch,
  arn: AmazonResourceNameSch,
  class: TableClassSch,

  partitionKey: KeyAttributeSch,
  sortKey: Optional(KeyAttributeSch),
  /**
   * TODO: Add 'provisionedThroughput' fields
   * {
   *   "LastIncreaseDateTime": "1970-01-01T00:00:00.000Z",
   *   "LastDecreaseDateTime": "1970-01-01T00:00:00.000Z",
   *   "NumberOfDecreasesToday": 0,
   *   "ReadCapacityUnits": 0,
   *   "WriteCapacityUnits": 0
   * }
   */
  billingMode: TableBillingModeSch,

  deletionProtection: BooleanSch(),

  status: TableStatusSch,

  nItems: IntegerSch({ inclusiveMinValue: 0 }),
  sizeBytes: IntegerSch({ inclusiveMinValue: 0 }),

  stream: TableStreamSpecificationSch,

  // multiRegionConsistency: TableMultiRegionConsistencySch.optional(),

  warmThroughput: Optional(TableWarmThroughputSch),

  localSecondaryIndexes: Optional(localIndexDescriptionSch.array()),
  globalSecondaryIndexes: Optional(globalIndexDescriptionSch.array()),

  createdAt: StringTimestampSch(),
});

export type TableDescription = z.infer<typeof TableDescriptionSch>;
