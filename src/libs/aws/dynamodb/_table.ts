import type { GlobalIndexRequirementInput } from './_schemas/_global-index';
import type { LocalIndexRequirementInput } from './_schemas/_local-index';
import { TableRequirementSch, type TableRequirement } from './_schemas/_table';

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
    this.localSecondaryIndexRequirements = localSecondaryIndexes;
    this.globalSecondaryIndexRequirements = globalSecondaryIndexes;
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
}
