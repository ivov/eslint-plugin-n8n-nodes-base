import rule from "../lib/rules/node-param-description-line-break-html-tag";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },

    // option
    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
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
        description: 'This is a <br /> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <br > sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <br> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a </br> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a </ br> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a sentence',
      };`,
    },

    // option

    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <br /> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
      };`,
    },

    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <br/> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
      };`,
    },

    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <br> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
      };`,
    },

    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a </br> sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
      };`,
    },

    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a </br > sentence',
      };`,
      errors: [{ messageId: "removeTag" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a sentence',
      };`,
    },
  ],
});
