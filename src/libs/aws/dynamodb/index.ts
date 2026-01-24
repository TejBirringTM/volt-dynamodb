import { TableRequirementSch, type TableRequirement } from './_schemas/_table';

export class Table<const R extends TableRequirement> {
  public readonly requirement;
  private constructor(requirement: R) {
    this.requirement = TableRequirementSch.parse(requirement) as R;
  }
  static create<const R extends TableRequirement>(requirement: R): Table<R> {
    return new Table(requirement);
  }
}
