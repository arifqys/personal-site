module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    // No need to import React, because React 17 using JSX transform
    'react/react-in-jsx-scope': 'off',
    // To allow include empty a tag inside next/link
    'jsx-a11y/anchor-is-valid': 'off',
    'no-underscore-dangle': 'off',
    'sort-imports': 'error',
    'react/jsx-sort-props': 'error',
    'react/sort-prop-types': 'error',
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@components', './src/components'],
          ['@lib', './src/lib'],
          ['@styles', './src/styles'],
        ],
      },
    },
  },
};
