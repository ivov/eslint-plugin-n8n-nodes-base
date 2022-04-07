import rule from "../lib/rules/node-param-default-wrong-for-options";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'first',
        options: [
          {
            name: 'First',
            value: 'first',
          },
          {
            name: 'Second',
            value: 'second',
          },
        ]
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'wrong',
        options: [
          {
            name: 'First',
            value: 'first',
          },
          {
            name: 'Second',
            value: 'second',
          },
        ]
      };`,
      errors: [
        {
          messageId: "chooseOption",
          data: { eligibleOptions: "'first' or 'second'" },
        },
      ],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'first',
        options: [
          {
            name: 'First',
            value: 'first',
          },
          {
            name: 'Second',
            value: 'second',
          },
        ]
      };`,
    },

    // in anticipation of typeOptions.loadOptionsMethod
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'wrong',
      };`,
      errors: [
        {
          messageId: "setEmptyString",
        },
      ],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: '',
      };`,
    },
  ],
});
