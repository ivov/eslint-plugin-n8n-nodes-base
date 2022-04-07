import rule from "../lib/rules/node-param-description-lowercase-first-char";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a test',
      };`,
    },
    {
      code: `const test = {
        name: 'Username',
        value: 'username',
        description: 'The name of the user',
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
        description: 'this is a test',
      };`,
      errors: [{ messageId: "uppercaseFirstChar" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a test',
      };`,
    },
    {
      code: `const test = {
        name: 'Username',
        value: 'username',
        description: 'the name of the user',
      };`,
      errors: [{ messageId: "uppercaseFirstChar" }],
      output: `const test = {
        name: 'Username',
        value: 'username',
        description: 'The name of the user',
      };`,
    },
  ],
});
