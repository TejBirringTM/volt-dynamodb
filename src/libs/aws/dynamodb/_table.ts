import {
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
  UpdateTableCommand,
  type DynamoDBClient,
  type KeySchemaElement,
} from '@aws-sdk/client-dynamodb';
import {
  GlobalIndexRequirementSch,
  type GlobalIndexRequirementInput,
} from './_schemas/_requirements/_global-index';
import {
  LocalIndexRequirementSch,
  type LocalIndexRequirementInput,
} from './_schemas/_requirements/_local-index';
import { TableRequirementSch, type TableRequirement } from './_schemas/_requirements/_table';
import { getClient } from './_client';
// import { VoltError } from '@/errors';
import { attrToAwsAttrDef, attrToAwsKeySchemaDef, projToAwsProjDef } from './_utils';
import logger from '@/_framework_/logger';

export class Table<
  const R extends TableRequirement,
  const LSI extends LocalIndexRequirementInput[],
  const GSI extends GlobalIndexRequirementInput<R>[],
> {
  public readonly tableRequirement;
  public readonly localSecondaryIndexRequirements;
  public readonly globalSecondaryIndexRequirements;
  private constructor({
    table,
    localSecondaryIndexes,
    globalSecondaryIndexes,
  }: {
    table: R;
    localSecondaryIndexes: LSI;
    globalSecondaryIndexes: GSI;
  }) {
    this.tableRequirement = TableRequirementSch.parse(table) as R;
    this.localSecondaryIndexRequirements = localSecondaryIndexes.map((lsi) =>
      LocalIndexRequirementSch.parse(lsi)
    ) as LSI;
    this.globalSecondaryIndexRequirements = globalSecondaryIndexes.map((gsi) =>
      GlobalIndexRequirementSch(table).parse(gsi)
    ) as GSI;
  }
  static create<
    const R extends TableRequirement,
    const LSI extends LocalIndexRequirementInput[],
    const GSI extends GlobalIndexRequirementInput<R>[],
  >(args: {
    table: R;
    localSecondaryIndexes: LSI;
    globalSecondaryIndexes: GSI;
  }): Table<R, LSI, GSI> {
    return new Table(args);
  }
  /**
   * Creates the table in AWS cloud infrastructure.
   * Throws on failure.
   *
   * @param client the AWS SDK DynamoDB Client instance
   */
  async up(client?: DynamoDBClient): Promise<void> {
    const c = getClient(client);
    const r = this.tableRequirement;
    const lsi = this.localSecondaryIndexRequirements; // <- different sort key, same partition
    const gsi = this.globalSecondaryIndexRequirements; // <-- different primary and sort key, different partition
    const attrs = [
      r.partitionKey,
      r.sortKey,
      ...lsi.map((i) => i.sortKey),
      ...gsi.flatMap((i) => [i.partitionKey, i.sortKey]),
    ]
      .filter((attr) => !!attr)
      .map((attr) => attrToAwsAttrDef(attr));
    const keySchema = (
      [
        attrToAwsKeySchemaDef('HASH', r.partitionKey),
        r.sortKey ? attrToAwsKeySchemaDef('RANGE', r.sortKey) : undefined,
      ] satisfies (KeySchemaElement | undefined)[]
    ).filter((attr) => !!attr);
    // ignore if table exist; TODO: sync instead!
    const tableNames = (await c.send(new ListTablesCommand())).TableNames ?? [];
    if (tableNames.includes(r.name)) {
      logger.info(`Skipping table creation; table already exists: ${r.name}`);
      return;
    }
    // create table
    const result = await c.send(
      new CreateTableCommand({
        TableName: r.name,
        TableClass: r.class,

        BillingMode: r.billingMode.type,
        OnDemandThroughput:
          r.billingMode.type === 'PAY_PER_REQUEST' &&
          (r.billingMode.maxReadRequestUnits || r.billingMode.maxWriteRequestUnits)
            ? {
                MaxReadRequestUnits: r.billingMode.maxReadRequestUnits ?? undefined,
                MaxWriteRequestUnits: r.billingMode.maxWriteRequestUnits ?? undefined,
              }
            : undefined,
        ProvisionedThroughput:
          r.billingMode.type === 'PROVISIONED'
            ? {
                ReadCapacityUnits: r.billingMode.readCapacityUnits,
                WriteCapacityUnits: r.billingMode.writeCapacityUnits,
              }
            : undefined,

        WarmThroughput:
          r.warmThroughputRequirement &&
          (r.warmThroughputRequirement.readUnitsPerSecond ||
            r.warmThroughputRequirement.writeUnitsPerSecond)
            ? {
                ReadUnitsPerSecond: r.warmThroughputRequirement.readUnitsPerSecond ?? undefined,
                WriteUnitsPerSecond: r.warmThroughputRequirement.writeUnitsPerSecond ?? undefined,
              }
            : undefined,

        AttributeDefinitions: attrs,
        KeySchema: keySchema,

        LocalSecondaryIndexes: lsi.map((i) => ({
          IndexName: i.name,
          KeySchema: [
            attrToAwsKeySchemaDef('HASH', r.partitionKey),
            attrToAwsKeySchemaDef('RANGE', i.sortKey),
          ],
          Projection: projToAwsProjDef(i.projection),
        })),

        GlobalSecondaryIndexes: gsi.map((i) => ({
          IndexName: i.name,
          KeySchema: i.sortKey
            ? [
                attrToAwsKeySchemaDef('HASH', i.partitionKey),
                attrToAwsKeySchemaDef('RANGE', i.sortKey),
              ]
            : [attrToAwsKeySchemaDef('HASH', i.partitionKey)],
          Projection: projToAwsProjDef(i.projection),
          WarmThroughput:
            i.warmThroughputRequirement &&
            (i.warmThroughputRequirement.readUnitsPerSecond ||
              i.warmThroughputRequirement.writeUnitsPerSecond)
              ? {
                  ReadUnitsPerSecond: i.warmThroughputRequirement.readUnitsPerSecond ?? undefined,
                  WriteUnitsPerSecond: i.warmThroughputRequirement.writeUnitsPerSecond ?? undefined,
                }
              : undefined,
          OnDemandThroughput:
            i.throughputRequirement.type === 'PAY_PER_REQUEST' &&
            (i.throughputRequirement.maxReadRequestUnits ||
              i.throughputRequirement.maxWriteRequestUnits)
              ? {
                  MaxReadRequestUnits: i.throughputRequirement.maxReadRequestUnits ?? undefined,
                  MaxWriteRequestUnits: i.throughputRequirement.maxWriteRequestUnits ?? undefined,
                }
              : undefined,
          ProvisionedThroughput:
            i.throughputRequirement.type === 'PROVISIONED'
              ? {
                  ReadCapacityUnits: i.throughputRequirement.readCapacityUnits,
                  WriteCapacityUnits: i.throughputRequirement.writeCapacityUnits,
                }
              : undefined,
        })),

        StreamSpecification:
          r.streamingRequirement && r.streamingRequirement !== 'NONE'
            ? {
                StreamEnabled: true,
                StreamViewType: r.streamingRequirement,
              }
            : undefined,

        DeletionProtectionEnabled: true,
        Tags: Object.entries(r.tags ?? {})
          .filter(([_, v]) => !!v)
          .map(([k, v]) => ({
            Key: k,
            Value: v!,
          })),
      })
    );
    logger.info(result.TableDescription, 'Table created');
  }
  /**
   * Destroy the table in AWS cloud infrastructure, if it exists.
   * Throws on failure.
   *
   * @param client the AWS SDK DynamoDB Client instance
   */
  async down(client?: DynamoDBClient): Promise<void> {
    const c = getClient(client);
    const r = this.tableRequirement;
    // ignore if table doesn't exist
    const tableNames = (await c.send(new ListTablesCommand())).TableNames ?? [];
    if (!tableNames.includes(r.name)) {
      logger.info(`Skipping table deletion; table does not exists: ${r.name}`);
      return;
    }
    // disable deletion protection
    await c.send(
      new UpdateTableCommand({
        TableName: r.name,
        DeletionProtectionEnabled: false,
      })
    );
    // delete table
    const result = await c.send(
      new DeleteTableCommand({
        TableName: r.name,
      })
    );
    logger.info(result.TableDescription, 'Table deleted');
  }
  /**
   * Ensure table in AWS cloud infrastructure matches the declaration.
   * Throws on failure.
   *
   * @param client the AWS SDK DynamoDB Client instance
   */
  // sync(client?: DynamoDBClient): Promise<void> {
  //   const _client = getClient(client);
  //   throw new VoltError('unimplemented', 'Table', 'sync');
  // }
  /**
   * Probe the table in AWS cloud infrastructure for information.
   * Throws on failure.
   *
   * @param client the AWS SDK DynamoDB Client instance
   */
  // probe(client?: DynamoDBClient) {
  //   const _client = getClient(client);
  //   throw new VoltError('unimplemented', 'Table', 'probe');
  // }
}
