import { VoltError } from '@/errors';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

let defaultClient: DynamoDBClient | null = null;

export function setDefaultClient(client: DynamoDBClient): void {
  defaultClient = client;
}

export function getClient(client?: DynamoDBClient): DynamoDBClient {
  const _client = client ?? defaultClient;
  if (!_client) {
    throw new VoltError('invalid-argument', 'No client provided for DynamoDB');
  }
  return _client;
}
