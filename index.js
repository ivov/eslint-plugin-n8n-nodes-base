"use strict";

const fs = require("fs");
const path = require("path");

const RULES_DIST_DIR = path.resolve(__dirname, "lib", "rules"); // /dist/lib/rules

const CONFIG_BASE_PROPERTIES = {
  env: { es2021: true },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["n8n-nodes-base"],
};

const AUTOFIXABLE_UNSAFE_RULESET = [
  "cred-class-name-unsuffixed",
  "cred-class-field-name-unsuffixed",
  "cred-class-field-name-uppercase-first-char",
  "node-param-array-type-assertion",
  "node-param-color-type-unused",
  "node-class-description-credentials-name-unsuffixed",
  "node-class-description-display-name-unsuffixed-trigger-node",
  "node-class-description-name-unsuffixed-trigger-node",
];

const DEFAULT_SEVERITY = "error";

const getRuleModule = (rulename) =>
  require(path.resolve(RULES_DIST_DIR, rulename)).default;

const ALL_RULE_NAMES = fs
  .readdirSync(RULES_DIST_DIR)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((filename) => filename.replace(/\.js$/, ""));

/**
 * All rules exported by this plugin.
 *
 * ```js
 * 'node-class-description-credentials-name-unsuffixed': {
 *   meta: { ... },
 *   create: { ... }
 * },
 * 'node-class-description-display-name-unsuffixed-trigger-node': {
 *   meta: { ... },
 *   create: { ... }
 * },
 * // etc
 * ```
 */
const allRules = ALL_RULE_NAMES.reduce((acc, rulename) => {
  return {
    ...acc,
    [rulename]: getRuleModule(rulename),
  };
}, {});

/**
 * Configs exported by this plugin.
 *
 * ```js
 * {
 *   "all": {
 *     env: { es2021: true },
 *     parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
 *     plugins: [ 'n8n-nodes-base' ],
 *     rules: {
 *       'n8n-nodes-base/cred-class-field-display-name-miscased': 'error',
 *       // etc: other rules
 *     }
 *  },
 *   "autofixable-safe": { ... },
 *   "autofixable-unsafe": { ... },
 *   "non-autofixable": { ... },
 *   "community": { ... },
 * }
 * ```
 */
const configs = ALL_RULE_NAMES.reduce(
  (acc, rulename) => {
    const fullRulename = `n8n-nodes-base/${rulename}`;
    const ruleModule = getRuleModule(rulename);

    acc["all"].rules[fullRulename] = DEFAULT_SEVERITY;

    const isAutofixable = ruleModule.meta.fixable !== undefined;

    if (rulename.startsWith("community-package-json")) {
      acc["community-nodes"].rules[fullRulename] = DEFAULT_SEVERITY;
    } else if (isAutofixable && AUTOFIXABLE_UNSAFE_RULESET.includes(rulename)) {
      acc["autofixable-unsafe"].rules[fullRulename] = DEFAULT_SEVERITY;
    } else if (isAutofixable) {
      acc["autofixable-safe"].rules[fullRulename] = DEFAULT_SEVERITY;
    } else {
      acc["non-autofixable"].rules[fullRulename] = DEFAULT_SEVERITY;
    }

    return acc;
  },
  {
    all: { ...CONFIG_BASE_PROPERTIES, rules: {} },
    "autofixable-safe": { ...CONFIG_BASE_PROPERTIES, rules: {} },
    "autofixable-unsafe": { ...CONFIG_BASE_PROPERTIES, rules: {} },
    "non-autofixable": { ...CONFIG_BASE_PROPERTIES, rules: {} },
    "community-nodes": { ...CONFIG_BASE_PROPERTIES, rules: {} },
  }
);

module.exports = {
  rules: allRules,
  configs,
  AUTOFIXABLE_UNSAFE_RULESET, // for make-docs-readme-table.js
};
