/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
  'mise.toml': () => 'mise fmt',
};
