import z from 'zod';
import { IntegerSch } from '@/_framework_/_common-attr-schemas';
import { Optional } from '@/_framework_/schema';
import {
  TableNameSch as IndexNameSch,
  TableBillingModeSch,
  TableStatusSch as IndexStatusSch,
  TableWarmThroughputSch,
  AmazonResourceNameSch,
} from '../_common/_table';
import { KeyAttributeSch } from '../_common/_attribute';
import { IndexAttributeProjectionRequirementSch } from '../_requirements/_index-attribute-projection-requirement';

export const globalIndexDescriptionSch = z.object({
  name: IndexNameSch,
  arn: AmazonResourceNameSch,
  status: IndexStatusSch,
  partitionKey: KeyAttributeSch,
  sortKey: Optional(KeyAttributeSch),
  projection: IndexAttributeProjectionRequirementSch,
  throughputRequirement: TableBillingModeSch,
  warmThroughputRequirement: Optional(TableWarmThroughputSch),
  nItems: IntegerSch({ inclusiveMinValue: 0 }),
  sizeBytes: IntegerSch({ inclusiveMinValue: 0 }),
});

export type GlobalIndexDescription = z.infer<typeof globalIndexDescriptionSch>;
