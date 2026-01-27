import z from 'zod';
import { type TableRequirement } from './_table';
import { KeyAttributeSch } from '../_common/_attribute';
import { IndexAttributeProjectionRequirementSch } from './_index-attribute-projection-requirement';
import { Optional } from '@/_framework_/schema';
import {
  TableNameSch as IndexNameSch,
  TableBillingModeSch,
  TableWarmThroughputSch,
  type TableBillingMode,
} from '../_common/_table';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const GlobalIndexRequirementSch = <const R extends TableRequirement>(requirement: R) =>
  z.object({
    name: IndexNameSch,
    partitionKey: KeyAttributeSch,
    sortKey: Optional(KeyAttributeSch),
    projection: IndexAttributeProjectionRequirementSch,
    throughputRequirement:
      requirement.billingMode.type === 'PAY_PER_REQUEST'
        ? TableBillingModeSch.options[0]
        : requirement.billingMode.type === 'PROVISIONED'
          ? TableBillingModeSch.options[1]
          : z.never(),
    warmThroughputRequirement: Optional(TableWarmThroughputSch),
  });
export type GlobalIndexRequirement<R extends TableRequirement> = z.infer<
  ReturnType<typeof GlobalIndexRequirementSch<R>>
>;

export type GlobalIndexRequirementInput<R extends TableRequirement> = Omit<
  GlobalIndexRequirement<R>,
  'throughputRequirement'
> & {
  throughputRequirement: R['billingMode']['type'] extends 'PAY_PER_REQUEST'
    ? FilterByProp<TableBillingMode, 'type', 'PAY_PER_REQUEST'>
    : R['billingMode']['type'] extends 'PROVISIONED'
      ? FilterByProp<TableBillingMode, 'type', 'PROVISIONED'>
      : never;
};
