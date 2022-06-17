"use strict";

// https://eslint.org/docs/developer-guide/shareable-configs#sharing-multiple-configs

// TODO: De-deduplicate with index.js

const fs = require("fs");
const path = require("path");

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

const rulesPath = path.join(__dirname, "lib", "rules"); // from dist

const allFullRuleNames = fs
  .readdirSync(rulesPath)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((fileName) => fileName.replace(/\.js$/, ""))
  .map((ruleName) => `n8n-nodes-base/${ruleName}`);

const categorized = allFullRuleNames.reduce(
  (acc, fullRuleName) => {
    const [_, ruleName] = fullRuleName.split("n8n-nodes-base/");
    const ruleModule = require(path.join(rulesPath, ruleName)).default;

    if (ruleModule.meta.fixable) {
      AUTOFIXABLE_UNSAFE_RULES.includes(ruleName)
        ? acc["autofixable-unsafe"].push(fullRuleName)
        : acc["autofixable-safe"].push(fullRuleName);
    } else {
      acc["non-autofixable"].push(fullRuleName);
    }

    return acc;
  },
  { "autofixable-safe": [], "autofixable-unsafe": [], "non-autofixable": [] }
);

function addSeverity(ruleNames, severity = "warn") {
  return ruleNames.reduce((acc, ruleName) => {
    return { ...acc, [ruleName]: severity };
  }, {});
}

// const BASE_CONFIG = {
//   env: { es2021: true },
//   parserOptions: {
//     ecmaVersion: "latest",
//     sourceType: "module",
//   },
//   plugins: ["n8n-nodes-base"],
// };

module.exports = {
  rules: addSeverity(categorized["non-autofixable"]),
};

console.log(module.exports);
