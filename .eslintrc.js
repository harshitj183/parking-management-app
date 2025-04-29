module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "globals": {
    "bootstrap": "readonly"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "indent": ["warn", 2],
    "semi": ["warn", "always"]
  },
  "ignorePatterns": [
    "node_modules/",
    "public/js/bootstrap.bundle.min.js"
  ]
};