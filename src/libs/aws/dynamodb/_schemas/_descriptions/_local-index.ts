import z from 'zod';
import { LocalIndexRequirementSch } from '../_requirements/_local-index';
import { IntegerSch } from '@/_framework_/_common-attr-schemas';

export const localIndexDescriptionSch = z.object({
  ...LocalIndexRequirementSch.shape,
  nItems: IntegerSch({ inclusiveMinValue: 0 }),
  sizeBytes: IntegerSch({ inclusiveMinValue: 0 }),
});

export type localIndexDescription = z.infer<typeof localIndexDescriptionSch>;
