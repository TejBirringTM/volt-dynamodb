import type {
  DynamoDBClient,
  // GetItemCommand,
  // GetItemCommandInput,
  // PutItemCommand,
  // PutItemCommandInput,
  // UpdateItemCommand,
  // UpdateItemCommandInput,
  // DeleteItemCommand,
  // DeleteItemCommandInput,
  // TransactGetItemsCommand,
  // TransactGetItemsCommandInput,
  // TransactWriteItemsCommand,
  // TransactWriteItemsCommandInput,
  // QueryCommand,
  // QueryCommandInput,
} from '@aws-sdk/client-dynamodb';

declare global {
  type Optional<T> = T | undefined | null;

  // use var to allow for redeclaration in TS
  var console: never;

  type FilterByProp<T, PropKey extends string | number | symbol, PropVal> = T extends {
    [K in PropKey]: PropVal;
  }
    ? T
    : never;

  type AssertExtends<A, B> = A extends B ? A : never;

  type Client = DynamoDBClient;
}

export {};
