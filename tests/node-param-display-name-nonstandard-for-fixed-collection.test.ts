import rule from "../lib/rules/node-param-display-name-nonstandard-for-fixed-collection";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'create',
            ],
          },
        },
      };`,
    },
    {
      code: `const test = {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'update',
            ],
          },
        },
      };`,
    },
    {
      code: `const test = {
        displayName: 'Options',
        name: 'options',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'getAll',
            ],
          },
        },
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Wrong',
        name: 'additionalFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'create',
            ],
          },
        },
      };`,
      errors: [{ messageId: "renameFixedCollection" }],
      output: `const test = {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'create',
            ],
          },
        },
      };`,
    },

    {
      code: `const test = {
        displayName: 'Wrong',
        name: 'updateFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'update',
            ],
          },
        },
      };`,
      errors: [{ messageId: "renameFixedCollection" }],
      output: `const test = {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'update',
            ],
          },
        },
      };`,
    },

    {
      code: `const test = {
        displayName: 'Wrong',
        name: 'options',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'getAll',
            ],
          },
        },
      };`,
      errors: [{ messageId: "renameFixedCollection" }],
      output: `const test = {
        displayName: 'Options',
        name: 'options',
        type: 'fixedCollection',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'ticket',
            ],
            operation: [
              'getAll',
            ],
          },
        },
      };`,
    },
  ],
});
