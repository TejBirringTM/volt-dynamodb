# Committing Code

Git commits must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification), a specification for adding human and machine readable meaning to commit messages.

Standardised commit history is easier to read and can be used to automatically generate useful changelogs.

## Allowed Commit Tags

[commitlint](https://commitlint.js.org/) is used to ensure conformity to the specification. The [`@commitlint/config-conventional`](https://www.npmjs.com/package/@commitlint/config-conventional) plugin allows the following commit tags:

### `build`

Changes that affect the build system or external dependencies (e.g., webpack, npm, gulp, or updating package versions)

### `chore`

Routine tasks and maintenance that don't modify source or test files (e.g., updating .gitignore, configuration files, or general housekeeping)

### `ci`

Changes to continuous integration configuration files and scripts (e.g., GitHub Actions, Jenkins, Travis CI, CircleCI configurations)

### `docs`

Documentation-only changes (e.g., README updates, code comments, or adding/updating documentation files)

### `feat`

New features or functionality added to the codebase

### `fix`

Bug fixes that resolve issues in the code

### `perf`

Performance improvements that make the code run faster or use fewer resources without changing functionality

### `refactor`

Code changes that neither fix bugs nor add features, but improve code structure, readability, or maintainability

### `revert`

Reverts a previous commit, undoing changes that were made earlier

### `style`

Changes that don't affect code meaning (e.g., formatting, white-space, missing semi-colons, code style improvements)

### `test`

Adding, updating, or fixing tests without changing production code
