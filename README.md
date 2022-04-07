# eslint-plugin-n8n-nodes-base

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-n8n-nodes-base.svg?style=flat)](https://npmjs.org/package/eslint-plugin-n8n-nodes-base)
[![Actions Status](https://github.com/ivov/eslint-plugin-n8n-nodes-base/workflows/checks/badge.svg)](https://github.com/ivov/eslint-plugin-n8n-nodes-base/actions)

ESLint plugin for linting n8n nodes.

## Usage

> Required: [ESLint VSCode extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

1. Install this plugin:

```sh
npm i -D eslint-plugin-n8n-nodes-base
```

2. Choose one of the three plugin configs:

- `recommended` (all rules)
- 🟢 `autofixable-safe` (does not cause breaking changes)
- 🔴 `autofixable-unsafe` (causes breaking changes)
- 🔵 `non-autofixable` (to be manually fixed)

3. Create the ESLint configuration file.

The following example...

- provides the `n8n-nodes-base` plugin,
- enables the rules tagged `recommended`, and
- disables a specific rule from the enabled set.

```js
{
  plugins: [ "eslint-plugin-n8n-nodes-base" ],
  extends: [ "plugin:n8n-nodes-base/recommended" ],
  rules: {
    "n8n-nodes-base/node-param-type-options-missing-from-limit": "off"
  }
}
```

Optionally, omit `extends` and enable rules individually:

```js
{
  plugins: [ "eslint-plugin-n8n-nodes-base" ],
  rules: {
    "n8n-nodes-base/node-param-type-options-missing-from-limit": "error"
    "n8n-nodes-base/node-param-resource-without-no-data-expression": "error"
    "n8n-nodes-base/node-param-resource-with-plural-option": "error"
  }
}
```

## Ruleset

<!-- RULES_TABLE -->
| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description | Autofixable |
| :-- | :-- | :-- |
| [cred-class-field-display-name-miscased](docs/rules/cred-class-field-display-name-miscased.md) | `displayName` field in credential class must be title cased. | 🟢 |
| [cred-class-field-display-name-missing-api](docs/rules/cred-class-field-display-name-missing-api.md) | `displayName` field in credential class must be end with `API`. | 🟢 |
| [cred-class-field-display-name-missing-oauth2](docs/rules/cred-class-field-display-name-missing-oauth2.md) | `displayName` field in credential class must mention `OAuth2` if applicable. | 🔵 |
| [cred-class-field-documentation-url-miscased](docs/rules/cred-class-field-documentation-url-miscased.md) | `documentationUrl` field in credential class must be camel cased. | 🟢 |
| [cred-class-field-documentation-url-missing](docs/rules/cred-class-field-documentation-url-missing.md) | `documentationUrl` field in credential class must be present. | 🟢 |
| [cred-class-field-name-missing-oauth2](docs/rules/cred-class-field-name-missing-oauth2.md) | `name` field in credential class must mention `OAuth2` if applicable. | 🔵 |
| [cred-class-field-name-unsuffixed](docs/rules/cred-class-field-name-unsuffixed.md) | `name` field in credential class must be suffixed with `-Api`. | 🔴 |
| [cred-class-field-name-uppercase-first-char](docs/rules/cred-class-field-name-uppercase-first-char.md) | First char in `name` in credential class must be lowercase. | 🔴 |
| [cred-class-field-placeholder-url-missing-eg](docs/rules/cred-class-field-placeholder-url-missing-eg.md) | `placeholder` for a URL in credential class must be prepended with `e.g.`. | 🟢 |
| [cred-class-name-missing-oauth2-suffix](docs/rules/cred-class-name-missing-oauth2-suffix.md) | Credential class name must mention `OAuth2` if applicable. | 🔵 |
| [cred-class-name-unsuffixed](docs/rules/cred-class-name-unsuffixed.md) | Credential class name must be suffixed with `-Api`. | 🔴 |
| [filesystem-wrong-cred-filename](docs/rules/filesystem-wrong-cred-filename.md) | Credentials filename must match credentials class name, excluding the filename suffix. Example: `TestApi.credentials.ts` matches `TestApi` in `class TestApi implements ICredentialType`. | 🔵 |
| [filesystem-wrong-node-dirname](docs/rules/filesystem-wrong-node-dirname.md) | Node dirname must match node filename, excluding the filename suffix. Example: `Test` node dirname matches `Test.node.ts` node filename. | 🔵 |
| [filesystem-wrong-node-filename](docs/rules/filesystem-wrong-node-filename.md) | Node filename must match `name` in node class description, excluding the filename suffix. Example: `Test.node.ts` matches `Test` in `Test.description.name`. | 🔵 |
| [filesystem-wrong-resource-description-filename](docs/rules/filesystem-wrong-resource-description-filename.md) | Resource description file must use singular form. Example: `UserDescription.ts`, not `UsersDescription.ts`. | 🔵 |
| [node-class-description-credentials-name-unsuffixed](docs/rules/node-class-description-credentials-name-unsuffixed.md) | `name` under `credentials` in node class description must be suffixed with `-Api`. | 🟢 |
| [node-class-description-display-name-unsuffixed-trigger-node](docs/rules/node-class-description-display-name-unsuffixed-trigger-node.md) | `displayName` in node class description for trigger node must be suffixed with `-Trigger`. | 🟢 |
| [node-class-description-empty-string](docs/rules/node-class-description-empty-string.md) | `description` in node class description must be filled out. | 🔵 |
| [node-class-description-icon-not-svg](docs/rules/node-class-description-icon-not-svg.md) | `icon` in node class description should be a non-SVG icon. | 🔵 |
| [node-class-description-inputs-wrong-regular-node](docs/rules/node-class-description-inputs-wrong-regular-node.md) | The number of `inputs` in node class description for regular node should be one, or two for Merge node. | 🟢 |
| [node-class-description-inputs-wrong-trigger-node](docs/rules/node-class-description-inputs-wrong-trigger-node.md) | The number of `inputs` in node class description for trigger node should be zero. | 🟢 |
| [node-class-description-missing-subtitle](docs/rules/node-class-description-missing-subtitle.md) | `subtitle` in node class description must be present. | 🟢 |
| [node-class-description-name-unsuffixed-trigger-node](docs/rules/node-class-description-name-unsuffixed-trigger-node.md) | `name` in node class description for trigger node must be suffixed with `-Trigger`. | 🟢 |
| [node-class-description-outputs-wrong](docs/rules/node-class-description-outputs-wrong.md) | The number of `outputs` in node class description for any node must be one, or two for If node, or four for Switch node. | 🟢 |
| [node-execute-block-missing-continue-on-fail](docs/rules/node-execute-block-missing-continue-on-fail.md) | The `execute()` method in a node must implement `continueOnFail` in a try-catch block. | 🔵 |
| [node-execute-block-wrong-error-thrown](docs/rules/node-execute-block-wrong-error-thrown.md) | The `execute()` method in a node may only throw `NodeApiError` for failed network requests and `NodeOperationError` for internal errors, not the built-in `Error`. | 🔵 |
| [node-param-array-type-assertion](docs/rules/node-param-array-type-assertion.md) | Array of node parameters must be typed, not type-asserted. | 🔴 |
| [node-param-collection-type-unsorted-items](docs/rules/node-param-collection-type-unsorted-items.md) | Items in collection-type node parameter must be alphabetized by `name` if more than five. | 🟢 |
| [node-param-color-type-unused](docs/rules/node-param-color-type-unused.md) | `color`-type must be used for color-related node parameter. | 🔴 |
| [node-param-default-missing](docs/rules/node-param-default-missing.md) | `default` must be present in a node parameter. | 🟢 |
| [node-param-default-wrong-for-boolean](docs/rules/node-param-default-wrong-for-boolean.md) | `default` for boolean-type node parameter must be a boolean. | 🟢 |
| [node-param-default-wrong-for-collection](docs/rules/node-param-default-wrong-for-collection.md) | `default` for collection-type node parameter must be an object. | 🟢 |
| [node-param-default-wrong-for-fixed-collection](docs/rules/node-param-default-wrong-for-fixed-collection.md) | `default` for fixed-collection-type node parameter must be an object. | 🟢 |
| [node-param-default-wrong-for-limit](docs/rules/node-param-default-wrong-for-limit.md) | `default` for a Limit node parameter must be 50 | 🟢 |
| [node-param-default-wrong-for-multi-options](docs/rules/node-param-default-wrong-for-multi-options.md) | `default` for a multi-options-type node parameter must be an array. | 🟢 |
| [node-param-default-wrong-for-number](docs/rules/node-param-default-wrong-for-number.md) | `default` for a number-type node parameter must be a number. | 🟢 |
| [node-param-default-wrong-for-options](docs/rules/node-param-default-wrong-for-options.md) | `default` for an options-type node parameter must be one of the options. | 🟢 |
| [node-param-default-wrong-for-simplify](docs/rules/node-param-default-wrong-for-simplify.md) | `default` for a Simplify node parameter must be `true`. | 🟢 |
| [node-param-default-wrong-for-string](docs/rules/node-param-default-wrong-for-string.md) | `default` for a string-type node parameter must be a string. | 🟢 |
| [node-param-description-boolean-without-whether](docs/rules/node-param-description-boolean-without-whether.md) | `description` in a boolean node parameter must start with `Whether`. | 🔵 |
| [node-param-description-empty-string](docs/rules/node-param-description-empty-string.md) | `description` in node parameter or in option in options-type and multi-options-type param must be filled out or removed. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-excess-final-period](docs/rules/node-param-description-excess-final-period.md) | `description` in node parameter must end without a final period if a single-sentence description. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-excess-inner-whitespace](docs/rules/node-param-description-excess-inner-whitespace.md) | `description` in node parameter must not contain excess inner whitespace. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-identical-to-display-name](docs/rules/node-param-description-identical-to-display-name.md) | `description` in node parameter must not be identical to `displayName`. | 🔵 |
| [node-param-description-line-break-html-tag](docs/rules/node-param-description-line-break-html-tag.md) | `description` in node parameter must not contain an HTML line break. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-lowercase-first-char](docs/rules/node-param-description-lowercase-first-char.md) | First char in `description` in node parameter must be uppercase. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-miscased-id](docs/rules/node-param-description-miscased-id.md) | `ID` in `description` in node parameter must be fully uppercased. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-missing-final-period](docs/rules/node-param-description-missing-final-period.md) | `description` in node parameter must end with a final period if a multiple-sentence description, unless ending with `</code>`. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-missing-for-return-all](docs/rules/node-param-description-missing-for-return-all.md) | `description` for Return All node parameter must be present. | 🟢 |
| [node-param-description-missing-for-simplify](docs/rules/node-param-description-missing-for-simplify.md) | `description` for Simplify node parameter must be present. | 🟢 |
| [node-param-description-missing-from-dynamic-multi-options](docs/rules/node-param-description-missing-from-dynamic-multi-options.md) | `description` in dynamic-multi-options-type node parameter must be present. | 🟢 |
| [node-param-description-missing-from-dynamic-options](docs/rules/node-param-description-missing-from-dynamic-options.md) | `description` in dynamic-options-type node parameter must be present. | 🟢 |
| [node-param-description-missing-from-limit](docs/rules/node-param-description-missing-from-limit.md) | `description` in Limit node parameter must be present. | 🟢 |
| [node-param-description-unencoded-angle-brackets](docs/rules/node-param-description-unencoded-angle-brackets.md) | `description` in node parameter must encode angle brackets for them to render. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-unneeded-backticks](docs/rules/node-param-description-unneeded-backticks.md) | `description` in node parameter must not use unneeded backticks. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-untrimmed](docs/rules/node-param-description-untrimmed.md) | `description` in node parameter must be trimmed. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-url-missing-protocol](docs/rules/node-param-description-url-missing-protocol.md) | `description` in node parameter must include protocol when containing a URL. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-weak](docs/rules/node-param-description-weak.md) | `description` in node parameter must be either useful or omitted. Applicable by extension to `description` in option in options-type and multi-options-type node parameter. | 🟢 |
| [node-param-description-wrong-for-dynamic-multi-options](docs/rules/node-param-description-wrong-for-dynamic-multi-options.md) | `description` in dynamic-multi-options-type node parameter must be `Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>` | 🟢 |
| [node-param-description-wrong-for-dynamic-options](docs/rules/node-param-description-wrong-for-dynamic-options.md) | `description` in dynamic-options-type node parameter must be `Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>` | 🟢 |
| [node-param-description-wrong-for-limit](docs/rules/node-param-description-wrong-for-limit.md) | `description` for Limit node parameter must be `Max number of results to return` | 🟢 |
| [node-param-description-wrong-for-return-all](docs/rules/node-param-description-wrong-for-return-all.md) | `description` for Return All node parameter must be `Whether to return all results or only up to a given limit` | 🟢 |
| [node-param-description-wrong-for-simplify](docs/rules/node-param-description-wrong-for-simplify.md) | `description` for Simplify node parameter must be `Whether to return a simplified version of the response instead of the raw data` | 🟢 |
| [node-param-description-wrong-for-upsert](docs/rules/node-param-description-wrong-for-upsert.md) | `description` for Upsert node parameter must be `Create a new record, or update the current one if it already exists (upsert)` | 🟢 |
| [node-param-display-name-excess-inner-whitespace](docs/rules/node-param-display-name-excess-inner-whitespace.md) | `displayName` in node parameter or in fixed collection section must not contain excess inner whitespace. Applicable by extension to `name` in options-type or multi-options-type node parameter. | 🟢 |
| [node-param-display-name-lowercase-first-char](docs/rules/node-param-display-name-lowercase-first-char.md) | First char in `displayName` in node parameter or in fixed collection section must be uppercase. Applicable by extension to `name` in options-type or multi-options-type node parameter. | 🟢 |
| [node-param-display-name-miscased-id](docs/rules/node-param-display-name-miscased-id.md) | `ID` in `displayName` in node parameter must be fully uppercased. Applicable by extension to `name` in options-type or multi-options-type node parameter. | 🟢 |
| [node-param-display-name-miscased](docs/rules/node-param-display-name-miscased.md) | `displayName` in node parameter or in fixed collection section must title cased. Applicable by extension to `name` in options-type or multi-options-type node parameter. | 🟢 |
| [node-param-display-name-nonstandard-for-fixed-collection](docs/rules/node-param-display-name-nonstandard-for-fixed-collection.md) | `displayName` for top-level fixed collection for create operation must be `Additional Fields`. `displayName` for top-level fixed collection for update operation must be `Update Fields`. `displayName` for top-level fixed collection for get-all operation must be `Options`. | 🟢 |
| [node-param-display-name-untrimmed](docs/rules/node-param-display-name-untrimmed.md) | `displayName` in node parameter or in fixed collection section must be trimmed. Applicable by extension to `name` in options-type or multi-options-type node parameter. | 🟢 |
| [node-param-display-name-wrong-for-dynamic-multi-options](docs/rules/node-param-display-name-wrong-for-dynamic-multi-options.md) | `displayName` for dynamic-multi-options-type node parameter must end with `Name or ID` | 🔵 |
| [node-param-display-name-wrong-for-dynamic-options](docs/rules/node-param-display-name-wrong-for-dynamic-options.md) | `displayName` for dynamic-options-type node parameter must end with `Name or ID` | 🔵 |
| [node-param-display-name-wrong-for-simplify](docs/rules/node-param-display-name-wrong-for-simplify.md) | `displayName` for Simplify node parameter must be Simplify | 🟢 |
| [node-param-display-name-wrong-for-update-fields](docs/rules/node-param-display-name-wrong-for-update-fields.md) | `displayName` for Update operation node parameter must be `Update Fields` | 🟢 |
| [node-param-fixed-collection-type-unsorted-items](docs/rules/node-param-fixed-collection-type-unsorted-items.md) | Items in a fixed-collection-type node parameter must be alphabetized by `displayName` if more than five. | 🟢 |
| [node-param-min-value-wrong-for-limit](docs/rules/node-param-min-value-wrong-for-limit.md) | `minValue` for Limit node parameter must be a positive integer. | 🟢 |
| [node-param-multi-options-type-unsorted-items](docs/rules/node-param-multi-options-type-unsorted-items.md) | Items in a multi-options-type node parameter must be alphabetized by `name` if more than five. | 🟢 |
| [node-param-operation-without-no-data-expression](docs/rules/node-param-operation-without-no-data-expression.md) | `noDataExpression` in an Operation node parameter must be present and enabled. | 🟢 |
| [node-param-option-description-identical-to-name](docs/rules/node-param-option-description-identical-to-name.md) | `description` in option in options-type node parameter must not be identical to `name`. | 🔵 |
| [node-param-option-name-containing-star](docs/rules/node-param-option-name-containing-star.md) | Option `name` in options-type node parameter must not contain `*`. Use `[All]` instead. | 🟢 |
| [node-param-option-name-duplicate](docs/rules/node-param-option-name-duplicate.md) | Option `name` in options-type node parameter must not be a duplicate. | 🟢 |
| [node-param-option-name-wrong-for-get-all](docs/rules/node-param-option-name-wrong-for-get-all.md) | Option `name` for Get All node parameter must be `Get All` | 🟢 |
| [node-param-option-name-wrong-for-upsert](docs/rules/node-param-option-name-wrong-for-upsert.md) | Option `name` for Upsert node parameter must be `Upsert`. | 🟢 |
| [node-param-option-value-duplicate](docs/rules/node-param-option-value-duplicate.md) | Option `value` in options-type node parameter must not be a duplicate. | 🟢 |
| [node-param-options-type-unsorted-items](docs/rules/node-param-options-type-unsorted-items.md) | Items in options-type node parameter must be alphabetized by `name` if more than five. | 🟢 |
| [node-param-required-false](docs/rules/node-param-required-false.md) | `required: false` in node parameter must be removed becaused it is implied. | 🟢 |
| [node-param-resource-with-plural-option](docs/rules/node-param-resource-with-plural-option.md) | Option `name` for a Resource node parameter must be singular. | 🟢 |
| [node-param-resource-without-no-data-expression](docs/rules/node-param-resource-without-no-data-expression.md) | `noDataExpression` in a Resource node parameter must be present and enabled. | 🟢 |
| [node-param-type-options-missing-from-limit](docs/rules/node-param-type-options-missing-from-limit.md) | `typeOptions` in Limit node parameter must be present. | 🟢 |
<!-- /RULES_TABLE -->

## Author

© 2022 [Iván Ovejero](https://github.com/ivov)

## License

Distributed under the [MIT License](LICENSE.md).
