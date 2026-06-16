import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        crypto: "readonly",
        document: "readonly",
        FileReader: "readonly",
        localStorage: "readonly",
        window: "readonly"
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules
    }
  }
];

