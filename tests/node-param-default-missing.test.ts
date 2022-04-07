import rule from "../lib/rules/node-param-default-missing";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'firstOption',
        options: [
          {
            name: 'First Option',
            value: 'firstOption',
          },
          {
            name: 'Second Option',
            value: 'secondOption',
          },
        ],
      };`,
    },
    {
      code: `const test = {
        displayName: 'Scope',
        name: 'scope',
        type: 'hidden',
        default: scopes.join(','),
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
            name: 'First Option',
            value: 'firstOption',
          },
          {
            name: 'Second Option',
            value: 'secondOption',
          },
        ],
      };`,
      errors: [{ messageId: "addDefault" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: 'firstOption',
        options: [
          {
            name: 'First Option',
            value: 'firstOption',
          },
          {
            name: 'Second Option',
            value: 'secondOption',
          },
        ],
      };`,
    },

    // no default when no options should add empty string as temp default
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
      };`,
      errors: [{ messageId: "addDefault" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'options',
        default: '',
      };`,
    },
  ],
});
