import { KeyAttributeSch, type KeyAttribute } from './_schemas/_common/_attribute';
import type {
  AttributeDefinition,
  GlobalSecondaryIndexDescription,
  KeySchemaElement,
  KeyType,
  LocalSecondaryIndexDescription,
  Projection,
  ScalarAttributeType,
  TableDescription,
} from '@aws-sdk/client-dynamodb';
import { VoltError } from '@/errors';
import type { LocalIndexRequirement } from './_schemas/_requirements/_local-index';
import type { IndexAttributeProjectionRequirement } from './_schemas/_requirements/_index-attribute-projection-requirement';
import {
  TableBillingModeSch,
  type TableBillingMode,
  type TableWarmThroughput,
} from './_schemas/_common/_table';

export const awsAttrTypeToAttrType = (attr: ScalarAttributeType): KeyAttribute['type'] => {
  switch (attr) {
    case 'B':
      return 'BINARY';
    case 'N':
      return 'NUMBER';
    case 'S':
      return 'STRING';
  }
};

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

export const awsKeySchemaToAttrs = (
  attrDefs: AttributeDefinition[],
  keySchema: KeySchemaElement[]
): { partitionKey: Optional<KeyAttribute>; sortKey: Optional<KeyAttribute> } => {
  const partitionKey = keySchema.find((k) => k.KeyType === 'HASH');
  const partitionKeyType = partitionKey
    ? attrDefs.find((a) => a.AttributeName === partitionKey.AttributeName)?.AttributeType
    : undefined;
  const sortKey = keySchema.find((k) => k.KeyType === 'RANGE');
  const sortKeyType = sortKey
    ? attrDefs.find((a) => a.AttributeName === sortKey.AttributeName)?.AttributeType
    : undefined;
  return {
    partitionKey:
      partitionKey && partitionKeyType
        ? KeyAttributeSch.parse({
            name: partitionKey.AttributeName,
            type: awsAttrTypeToAttrType(partitionKeyType),
          })
        : undefined,
    sortKey:
      sortKey && sortKeyType
        ? KeyAttributeSch.parse({
            name: sortKey.AttributeName,
            type: awsAttrTypeToAttrType(sortKeyType),
          })
        : undefined,
  };
};

export const awsIndexToProjection = (
  idx: LocalSecondaryIndexDescription | GlobalSecondaryIndexDescription
): IndexAttributeProjectionRequirement => {
  const projection =
    idx.Projection?.ProjectionType === 'INCLUDE'
      ? ({
          type: 'PROJECT_SELECTED_ATTRIBUTES_ALONGSIDE_KEY_ATTRIBUTES',
          attributeNames: idx.Projection.NonKeyAttributes ?? [],
        } satisfies IndexAttributeProjectionRequirement)
      : idx.Projection?.ProjectionType === 'KEYS_ONLY'
        ? ({
            type: 'PROJECT_KEY_ATTRIBUTES_ONLY',
          } satisfies IndexAttributeProjectionRequirement)
        : idx.Projection?.ProjectionType === 'ALL'
          ? ({
              type: 'PROJECT_ALL_ATTRIBUTES',
            } satisfies IndexAttributeProjectionRequirement)
          : null;
  if (!projection) {
    throw new VoltError('unexpected-response-from-upstream', 'projection type not recognised');
  }
  return projection;
};

export const awsTableOrIndexToBillingMode = (
  table: TableDescription,
  gsi?: GlobalSecondaryIndexDescription
): TableBillingMode => {
  const billingMode =
    table.BillingModeSummary?.BillingMode === 'PAY_PER_REQUEST'
      ? TableBillingModeSch.parse({
          type: 'PAY_PER_REQUEST',
          maxReadRequestUnits:
            gsi?.OnDemandThroughput?.MaxReadRequestUnits ??
            table.OnDemandThroughput?.MaxReadRequestUnits,
          maxWriteRequestUnits:
            gsi?.OnDemandThroughput?.MaxWriteRequestUnits ??
            table.OnDemandThroughput?.MaxWriteRequestUnits,
        })
      : table.BillingModeSummary?.BillingMode === 'PROVISIONED'
        ? TableBillingModeSch.parse({
            type: 'PROVISIONED',
            readCapacityUnits:
              gsi?.ProvisionedThroughput?.ReadCapacityUnits ??
              table.ProvisionedThroughput?.ReadCapacityUnits,
            writeCapacityUnits:
              gsi?.ProvisionedThroughput?.WriteCapacityUnits ??
              table.ProvisionedThroughput?.WriteCapacityUnits,
          })
        : null;
  if (!billingMode) {
    throw new VoltError('unexpected-response-from-upstream', 'billing mode not recognised');
  }
  return billingMode;
};

export const awsTableOrIndexToWarmThroughput = (
  table: TableDescription | GlobalSecondaryIndexDescription
): Optional<TableWarmThroughput> => {
  const warmThroughput =
    table.WarmThroughput &&
    (table.WarmThroughput.ReadUnitsPerSecond || table.WarmThroughput.WriteUnitsPerSecond)
      ? ({
          readUnitsPerSecond: table.WarmThroughput.ReadUnitsPerSecond,
          writeUnitsPerSecond: table.WarmThroughput.WriteUnitsPerSecond,
        } satisfies TableWarmThroughput)
      : undefined;
  return warmThroughput;
};
