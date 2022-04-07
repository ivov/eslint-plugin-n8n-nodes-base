import rule from "../lib/rules/node-param-resource-with-plural-option";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user',
          },
        ],
        default: 'contact',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Users',
            value: 'user',
          },
        ],
        default: 'contact',
      };`,
      errors: [{ messageId: "useSingular" }],
      output: `const test = {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user',
          },
        ],
        default: 'contact',
      };`,
    },
  ],
});
