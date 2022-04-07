import rule from "../lib/rules/node-param-display-name-lowercase-first-char";
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
        displayName: 'test',
        name: 'test',
        type: 'string',
        default: '',
      };`,
      errors: [{ messageId: "uppercaseFirstChar" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
      };`,
    },
    {
      code: `const test = {
        name: 'user ID',
        value: 'userId',
      };`,
      errors: [{ messageId: "uppercaseFirstChar" }],
      output: `const test = {
        name: 'User ID',
        value: 'userId',
      };`,
    },

    {
      code: `const test = {
        displayName: 'test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details',
            name: 'detailsTest',
            values: [
              {
                displayName: 'A',
                name: 'a',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      };`,
      errors: [{ messageId: "uppercaseFirstChar" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details',
            name: 'detailsTest',
            values: [
              {
                displayName: 'A',
                name: 'a',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      };`,
    },
  ],
});
