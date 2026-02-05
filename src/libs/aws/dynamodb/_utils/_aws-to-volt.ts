import type {
  AttributeDefinition,
  GlobalSecondaryIndexDescription,
  KeySchemaElement,
  LocalSecondaryIndexDescription,
  ScalarAttributeType,
  TableDescription,
} from '@aws-sdk/client-dynamodb';
import { KeyAttributeSch, type KeyAttribute } from '../_schemas/_common/_attribute';
import type { IndexAttributeProjectionRequirement } from '../_schemas/_requirements/_index-attribute-projection-requirement';
import { VoltError } from '@/errors';
import {
  TableBillingModeSch,
  type TableBillingMode,
  type TableWarmThroughput,
} from '../_schemas/_common/_table';

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
