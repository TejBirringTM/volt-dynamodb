import { Table } from '../libs/aws/dynamodb/_table';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mockTableConst() {
  return Table.create({
    table: {
      schemaId: 'TableRequirement/v0',
      name: 'MyApp.Users',
      class: 'STANDARD_INFREQUENT_ACCESS',
      billingMode: {
        type: 'PAY_PER_REQUEST',
      },
      partitionKey: {
        name: 'pk',
        type: 'STRING',
      },
      sortKey: {
        name: 'sk',
        type: 'STRING',
      },
      streamingRequirement: 'NONE',
      tags: {
        application: 'MyApp',
      },
    },
    localSecondaryIndexes: [
      {
        name: 'MyLSI',
        sortKey: {
          name: 'email',
          type: 'STRING',
        },
        projection: {
          type: 'PROJECT_ALL_ATTRIBUTES',
        },
      },
    ],
    globalSecondaryIndexes: [
      {
        name: 'MyGSI',
        throughputRequirement: {
          type: 'PAY_PER_REQUEST',
        },
        partitionKey: {
          name: 'ppk',
          type: 'STRING',
        },
        projection: {
          type: 'PROJECT_ALL_ATTRIBUTES',
        },
      },
    ],
  });
}
