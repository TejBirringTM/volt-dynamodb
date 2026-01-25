import z from 'zod';
import {
  TableNameSch as IndexNameSch,
  TableBillingModeSch,
  TableWarmThroughputRequirementSch,
  type TableRequirement,
} from './_table';
import { KeyAttributeRequirementSch } from './_attribute';
import { IndexAttributeProjectionRequirementSch } from './_index-attribute-projection-requirement';
import { Optional } from '@/_framework_/schema';

export const GlobalIndexRequirementSch = <const R extends TableRequirement>(requirement: R) =>
  z.object({
    name: IndexNameSch,
    primaryKey: KeyAttributeRequirementSch,
    sortKey: KeyAttributeRequirementSch,
    projection: IndexAttributeProjectionRequirementSch,
    throughputRequirement:
      requirement.billingMode.type === 'PAY_PER_REQUEST'
        ? TableBillingModeSch.options[0]
        : requirement.billingMode.type === 'PROVISIONED'
          ? TableBillingModeSch.options[1]
          : z.never(),
    warmThroughputRequirement: Optional(TableWarmThroughputRequirementSch),
  });
export type GlobalIndexRequirement<R extends TableRequirement> = z.infer<
  typeof GlobalIndexRequirementSch<R>
>;
