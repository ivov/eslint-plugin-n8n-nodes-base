import rule from "../lib/rules/node-param-default-wrong-for-limit";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
      };`,
      errors: [{ messageId: "setLimitDefault" }],
      output: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
      };`,
    },
  ],
});
