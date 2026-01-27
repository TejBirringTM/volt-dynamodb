import z from 'zod';
import { KeyAttributeSch } from '../_common/_attribute';
import { IndexAttributeProjectionRequirementSch } from './_index-attribute-projection-requirement';
import { TableNameSch as IndexNameSch } from '../_common/_table';

export const LocalIndexRequirementSch = z.object({
  name: IndexNameSch,
  sortKey: KeyAttributeSch,
  projection: IndexAttributeProjectionRequirementSch,
});
export type LocalIndexRequirement = z.infer<typeof LocalIndexRequirementSch>;

export type LocalIndexRequirementInput = LocalIndexRequirement;
