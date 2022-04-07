import rule from "../lib/rules/node-param-display-name-miscased";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test of Tests',
        name: 'testOfTests',
        type: 'string',
        default: '',
      };`,
    },
    {
      code: `const test = {
        name: 'Test of Tests',
        value: 'testOfTests',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test of tests',
        name: 'testOfTests',
        type: 'string',
        default: '',
      };`,
      errors: [{ messageId: "useTitleCase" }],
      output: `const test = {
        displayName: 'Test of Tests',
        name: 'testOfTests',
        type: 'string',
        default: '',
      };`,
    },
    {
      code: `const test = {
        name: 'Test of tests',
        value: 'testOfTests',
      };`,
      errors: [{ messageId: "useTitleCase" }],
      output: `const test = {
        name: 'Test of Tests',
        value: 'testOfTests',
      };`,
    },

    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details test',
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
      errors: [{ messageId: "useTitleCase" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details Test',
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
