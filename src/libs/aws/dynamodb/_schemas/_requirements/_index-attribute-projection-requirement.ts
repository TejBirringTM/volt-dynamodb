import z from 'zod';
import { AttributeNameSch } from '../_common/_attribute';

export const IndexAttributeProjectionRequirementSch = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PROJECT_KEY_ATTRIBUTES_ONLY'),
  }),
  z.object({
    type: z.literal('PROJECT_ALL_ATTRIBUTES'),
  }),
  z.object({
    type: z.literal('PROJECT_SELECTED_ATTRIBUTES_ALONGSIDE_KEY_ATTRIBUTES'),
    attributeNames: AttributeNameSch.array(),
  }),
]);
