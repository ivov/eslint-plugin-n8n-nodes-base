import rule from "../lib/rules/node-param-option-name-duplicate";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        options: [
          {
            name: 'A',
            value: 'a',
          },
          {
            name: 'B',
            value: 'b',
          },
        ],
        default: 'a',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        options: [
          {
            name: 'A',
            value: 'a',
          },
          {
            name: 'A',
            value: 'b',
          },
        ],
        default: 'a',
      };`,
      errors: [{ messageId: "removeDuplicate" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        options: [
          {
            name: 'A',
            value: 'a',
          },
        ],
        default: 'a',
      };`,
    },
  ],
});
