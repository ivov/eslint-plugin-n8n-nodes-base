import rule from "../lib/rules/node-param-default-wrong-for-number";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'number',
        default: 0,
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'number',
        default: '0',
      };`,
      errors: [{ messageId: "setNumberDefault" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'number',
        default: 0,
      };`,
    },
  ],
});
