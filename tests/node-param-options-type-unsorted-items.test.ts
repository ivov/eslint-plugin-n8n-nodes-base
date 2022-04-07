import rule from "../lib/rules/node-param-options-type-unsorted-items";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'a',
        options: [
          {
            name: 'A',
            value: 'a',
          },
          {
            name: 'B',
            value: 'b',
          },
          {
            name: 'C',
            value: 'c',
          },
          {
            name: 'D',
            value: 'd',
          },
          {
            name: 'E',
            value: 'e',
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
        type: 'options',
        default: 'a',
        options: [
          {
            name: 'B',
            value: 'b',
          },
          {
            name: 'A',
            value: 'a',
          },
          {
            name: 'C',
            value: 'c',
          },
          {
            name: 'D',
            value: 'd',
          },
          {
            name: 'E',
            value: 'e',
          },
        ],
      };`,
      errors: [
        { messageId: "sortItems", data: { displayOrder: "A | B | C | D | E" } },
      ],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'a',
        options: [
          {
            name: 'A',
            value: 'a',
          },
          {
            name: 'B',
            value: 'b',
          },
          {
            name: 'C',
            value: 'c',
          },
          {
            name: 'D',
            value: 'd',
          },
          {
            name: 'E',
            value: 'e',
          },
        ],
      };`,
    },
  ],
});
