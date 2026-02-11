import { _theseVarsWillBeUsedInTheFuture_ } from '@/utils/placeholders';
import type { TableDescription } from '../_schemas/_descriptions/_table';
import type { TableRequirement } from '../_schemas/_requirements/_table';
import type { TableDifferential } from '../_types/_diff';

export const diffRequirementAgainstDescription = (
  requirement: TableRequirement,
  description: TableDescription
): TableDifferential => {
  _theseVarsWillBeUsedInTheFuture_(requirement, description);
  // TODO: implement this function
  return {
    class: false,
    billingMode: false,
    streamingRequirement: false,
    warmThroughputRequirement: false,
    tags: false,
  };
};
