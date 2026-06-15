module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  overrides: [
    {
      files: ["**/*.test.jsx", "**/tests/**"],
      env: {
        node: true,
        jest: true
      }
    }
  ]
};
