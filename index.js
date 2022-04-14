"use strict";

const fs = require("fs");
const path = require("path");

const rulesPath = path.join(__dirname, "lib", "rules"); // from dist

const allFullRuleNames = fs
  .readdirSync(rulesPath)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((fileName) => fileName.replace(/\.js$/, ""))
  .map((ruleName) => `n8n-nodes-base/${ruleName}`);

/**
 * Rules exported by this plugin:
 *
 * ```js
 * 'node-param-display-name-lowercase-first-char': {
 *   meta: { ... },
 *   create: { ... }
 * },
 * 'node-param-display-name-miscased-id': {
 *   meta: { ... },
 *   create: { ... }
 * },
 * // etc
 * ```
 */
module.exports.rules = allFullRuleNames.reduce((acc, fullRuleName) => {
  const [_, ruleName] = fullRuleName.split("n8n-nodes-base/");
  return {
    ...acc,
    [ruleName]: require(path.join(rulesPath, ruleName)).default,
  };
}, {});

/**
 * Rules whose autofixes are breaking changes.
 */
const AUTOFIXABLE_UNSAFE_RULES = [
  "cred-class-name-unsuffixed",
  "cred-class-field-name-unsuffixed",
  "cred-class-field-name-uppercase-first-char",
  "node-param-array-type-assertion",
  "node-param-color-type-unused",
  "node-class-description-credentials-name-unsuffixed",
  "node-class-description-display-name-unsuffixed-trigger-node",
  "node-class-description-name-unsuffixed-trigger-node",
];

const categorized = allFullRuleNames.reduce(
  (acc, fullRuleName) => {
    const [_, ruleName] = fullRuleName.split("n8n-nodes-base/");
    const ruleModule = require(path.join(rulesPath, ruleName)).default;

    if (ruleModule.meta.fixable) {
      AUTOFIXABLE_UNSAFE_RULES.includes(ruleName)
        ? acc["autofixable-unsafe"].push(fullRuleName)
        : acc["autofixable-safe"].push(fullRuleName);
    } else {
      acc['non-autofixable'].push(fullRuleName);
    }

    return acc;
  },
  { 'autofixable-safe': [], 'autofixable-unsafe': [], 'non-autofixable': [] }
);

function addSeverity(ruleNames, severity = "warn") {
  return ruleNames.reduce((acc, ruleName) => {
    return { ...acc, [ruleName]: severity };
  }, {});
}

const BASE_CONFIG = {
  env: { es2021: true },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["n8n-nodes-base"],
};

/**
 * Configs exported by this plugin:
 *
 * ```js
 * {
 *   recommended: {
 *     env: { es2021: true },
 *     parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
 *     plugins: [ 'n8n-nodes-base' ],
 *     rules: {
 *       'n8n-nodes-base/cred-class-field-display-name-miscased': 'warn',
 *       // etc
 *     }
 *  },
 * // etc
 * }
 * ```
 */
module.exports.configs = {
  recommended: {
    ...BASE_CONFIG,
    rules: addSeverity(allFullRuleNames),
  },
  'autofixable-safe': {
    ...BASE_CONFIG,
    rules: addSeverity(categorized['autofixable-safe']),
  },
  'autofixable-unsafe': {
    ...BASE_CONFIG,
    rules: addSeverity(categorized['autofixable-unsafe']),
  },
  'non-autofixable': {
    ...BASE_CONFIG,
    rules: addSeverity(categorized['non-autofixable']),
  },
};

module.exports.AUTOFIXABLE_UNSAFE_RULES = AUTOFIXABLE_UNSAFE_RULES;