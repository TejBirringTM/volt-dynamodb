import { describe, it } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockTableConst } from '@/__mocks__/table';
import { sleep } from 'effect/Clock';

const client = new DynamoDBClient();
let table: ReturnType<typeof mockTableConst>;

describe('DynamoDB Table class', () => {
  it('should create a strongly-typed Table instance', () => {
    table = mockTableConst();
    // TODO: type assertions here...
  });
  it('should be able to create and delete a Table in AWS', async () => {
    await table.up(client);
    sleep('3 seconds');
    await table.down(client);
  });
  it('should not error on attempt to create same table more than once - further attempts skipped', async () => {
    await table.up(client);
    sleep('3 seconds');
    await table.up(client);
  });
  it('should not error on attempt to delete same table more than once - further attempts skipped', async () => {
    await table.down(client);
    sleep('3 seconds');
    await table.down(client);
  });
});
