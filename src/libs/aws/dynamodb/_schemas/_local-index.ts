import z from 'zod';
import { TableNameSch as IndexNameSch } from './_table';
import { KeyAttributeRequirementSch } from './_attribute';
import { IndexAttributeProjectionRequirementSch } from './_index-attribute-projection-requirement';

export const LocalIndexRequirementSch = z.object({
  name: IndexNameSch,
  sortKey: KeyAttributeRequirementSch,
  projection: IndexAttributeProjectionRequirementSch,
});
export type LocalIndexRequirement = z.infer<typeof LocalIndexRequirementSch>;

export type LocalIndexRequirementInput = LocalIndexRequirement;
