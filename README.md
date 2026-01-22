# Volt for DynamoDB

## Workflows

### Publishing

- Make changes

- Write tests

- Run tests locally:
  `pnpm test`

- Create a changeset:
  `pnpm changeset`
  - _(follow prompts to describe changes)_

- Commit changes with conventional commits:  
  `git commit -m "feat: add new feature"`

- **When ready to release**
  - Update version and changelog:
    `pnpm version`
  - Publish the release:
    `pnpm release`
