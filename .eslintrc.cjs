/**
 * @type import('eslint').Linter.Config
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'prettier',
    './.eslintrc-auto-import.json',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.vue'],
      },
    },
  },
  rules: {
    // file extensions
    'import/extensions': ['error', { js: 'never', ts: 'never', vue: 'always' }],
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['./src/store/**/*.ts'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
