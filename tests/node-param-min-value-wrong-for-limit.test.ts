import rule from "../lib/rules/node-param-min-value-wrong-for-limit";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: {
          minValue: 1,
        },
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: {
          minValue: 0,
        },
      };`,
      errors: [{ messageId: "setPositiveMinValue" }],
      output: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: {
          minValue: 1,
        },
      };`,
    },
  ],
});
