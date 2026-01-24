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

  type Client = DynamoDBClient;
}

export {};
