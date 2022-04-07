import rule from "../lib/rules/node-param-fixed-collection-type-unsorted-items";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details',
            name: 'details',
            values: [
              {
                displayName: 'A',
                name: 'a',
                type: 'string',
                default: '',
              },
              {
                displayName: 'B',
                name: 'b',
                type: 'string',
                default: '',
              },
              {
                displayName: 'C',
                name: 'c',
                type: 'string',
                default: '',
              },
              {
                displayName: 'D',
                name: 'd',
                type: 'string',
                default: '',
              },
              {
                displayName: 'E',
                name: 'e',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details',
            name: 'details',
            values: [
              {
                displayName: 'B',
                name: 'b',
                type: 'string',
                default: '',
              },
              {
                displayName: 'A',
                name: 'a',
                type: 'string',
                default: '',
              },
              {
                displayName: 'C',
                name: 'c',
                type: 'string',
                default: '',
              },
              {
                displayName: 'D',
                name: 'd',
                type: 'string',
                default: '',
              },
              {
                displayName: 'E',
                name: 'e',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      };`,
      errors: [
        { messageId: "sortItems", data: { displayOrder: "A | B | C | D | E" } },
      ],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'fixedCollection',
        default: 'a',
        options: [
          {
            displayName: 'Details',
            name: 'details',
            values: [
              {
                displayName: 'A',
                name: 'a',
                type: 'string',
                default: '',
              },
              {
                displayName: 'B',
                name: 'b',
                type: 'string',
                default: '',
              },
              {
                displayName: 'C',
                name: 'c',
                type: 'string',
                default: '',
              },
              {
                displayName: 'D',
                name: 'd',
                type: 'string',
                default: '',
              },
              {
                displayName: 'E',
                name: 'e',
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
