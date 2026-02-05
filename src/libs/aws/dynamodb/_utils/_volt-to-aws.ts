import type {
  AttributeDefinition,
  KeySchemaElement,
  KeyType,
  Projection,
} from '@aws-sdk/client-dynamodb';
import type { KeyAttribute } from '../_schemas/_common/_attribute';
import { VoltError } from '@/errors';
import type { LocalIndexRequirement } from '../_schemas/_requirements/_local-index';

export const attrToAwsAttrDef = (attr: KeyAttribute): AttributeDefinition => {
  const type =
    attr.type === 'STRING'
      ? 'S'
      : attr.type === 'NUMBER'
        ? 'N'
        : attr.type === 'BINARY'
          ? 'B'
          : null;
  if (type === null) {
    throw new VoltError('invalid-argument', `Unsupported attribute type: ${attr.type}`);
  }
  return {
    AttributeName: attr.name,
    AttributeType: type,
  };
};

export const projToAwsProj = (proj: LocalIndexRequirement['projection']): Projection => {
  const type =
    proj.type === 'PROJECT_ALL_ATTRIBUTES'
      ? 'ALL'
      : proj.type === 'PROJECT_KEY_ATTRIBUTES_ONLY'
        ? 'KEYS_ONLY'
        : proj.type === 'PROJECT_SELECTED_ATTRIBUTES_ALONGSIDE_KEY_ATTRIBUTES'
          ? 'INCLUDE'
          : null;
  if (type === null) {
    throw new VoltError('invalid-argument', `Unsupported attribute projection type: ${proj.type}`);
  }
  return {
    ProjectionType: type,
    NonKeyAttributes:
      proj.type === 'PROJECT_SELECTED_ATTRIBUTES_ALONGSIDE_KEY_ATTRIBUTES'
        ? proj.attributeNames
        : undefined,
  };
};

export const attrToAwsKeySchema = (keyType: KeyType, attr: KeyAttribute): KeySchemaElement => {
  return {
    AttributeName: attr.name,
    KeyType: keyType,
  };
};
