module.exports = {
  env: {
    browser: true,
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-native',
  ],
  rules: {
    'nonblock-statement-body-position': 'off',
    curly: 'off',
    'no-use-before-define': ['error', { variables: false }],
    'linebreak-style': 'off',
    'object-curly-newline': 'off',
    'react/prop-types': 'off',
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 'off',
    'react-native/no-single-element-style-arrays': 2,
  },
};
