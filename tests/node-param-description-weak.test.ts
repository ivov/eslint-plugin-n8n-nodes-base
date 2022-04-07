import rule from "../lib/rules/node-param-description-weak";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'The operation to perform',
      };`,
      errors: [{ messageId: "removeWeakDescription" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The operation to perform',
      };`,
      errors: [{ messageId: "removeWeakDescription" }],
      output: `const test = {
        name: 'User ID',
        value: 'userId',
      };`,
    },
  ],
});
