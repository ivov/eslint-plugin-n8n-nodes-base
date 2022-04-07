import rule from "../lib/rules/node-param-description-url-missing-protocol";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <a href="https://github.com">link</a>',
      };`,
    },
    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <a href="https://github.com">link</a>',
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
        description: 'This is a <a href="github.com">link</a>',
      };`,
      errors: [{ messageId: "addProtocol" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <a href="https://github.com">link</a>',
      };`,
    },
    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <a href="github.com">link</a>',
      };`,
      errors: [{ messageId: "addProtocol" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <a href="https://github.com">link</a>',
      };`,
    },
  ],
});
