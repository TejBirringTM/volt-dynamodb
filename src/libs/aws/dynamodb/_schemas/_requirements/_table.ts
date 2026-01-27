import { CommonAttributeSchemas as Attr, declareSchema, Optional } from '@/_framework_/schema';
import { KeyAttributeSch } from '../_common/_attribute';
import z from 'zod';
import {
  TableBillingModeSch,
  TableClassSch,
  TableNameSch,
  TableStreamSpecificationSch,
  TableWarmThroughputSch,
} from '../_common/_table';

/**
 *
 * See:
 */
export const TableRequirementSch = declareSchema('TableRequirement', 0, {
  name: TableNameSch,
  class: TableClassSch,
  billingMode: TableBillingModeSch,
  warmThroughputRequirement: Optional(TableWarmThroughputSch),
  streamingRequirement: Optional(TableStreamSpecificationSch),
  partitionKey: KeyAttributeSch,
  sortKey: Optional(KeyAttributeSch),
  tags: Optional(Attr.StringDictionarySch({})),
});
export type TableRequirement = z.infer<typeof TableRequirementSch>;
