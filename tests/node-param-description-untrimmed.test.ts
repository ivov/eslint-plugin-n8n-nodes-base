import rule from "../lib/rules/node-param-description-untrimmed";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Operation',
        name: 'operation',
        type: 'string',
        default: '',
        description: 'This is a description',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The ID of the user',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Operation',
        name: 'operation',
        type: 'string',
        default: '',
        description: 'This is a description   ',
      };`,
      errors: [{ messageId: "trimWhitespace" }],
      output: `const test = {
        displayName: 'Operation',
        name: 'operation',
        type: 'string',
        default: '',
        description: 'This is a description',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The ID of the user   ',
      };`,
      errors: [{ messageId: "trimWhitespace" }],
      output: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The ID of the user',
      };`,
    },
  ],
});
