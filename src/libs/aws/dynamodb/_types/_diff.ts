import type { TableRequirement } from '../_schemas/_requirements/_table';

type BaseTableDifferential<
  T,
  ImplicitlyBannedKey extends string,
  ExplicitlyBannedKey extends string,
> =
  Omit<T, ImplicitlyBannedKey> extends object
    ? {
        [K in keyof Omit<T, ImplicitlyBannedKey>]-?: K extends ExplicitlyBannedKey
          ? 'ERROR:THIS-IS-NOT-ALLOWED!!!' | false
          : boolean;
      }
    : never;

export type TableDifferential = BaseTableDifferential<
  TableRequirement,
  'name' | 'schemaId' | 'partitionKey' | 'sortKey',
  ''
>;
