import rule from "../lib/rules/node-param-description-missing-final-period";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This a sentence. This is another.',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This a sentence. This is another</code>',
      };`,
    },
    {
      code: `const test = {
        name: 'Username',
        value: 'username',
        description: 'First sentence. Second sentence.',
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
        description: 'This a sentence. This is another',
      };`,
      errors: [{ messageId: "missingFinalPeriod" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This a sentence. This is another.',
      };`,
    },
    {
      code: `const test = {
        name: 'Username',
        value: 'username',
        description: 'First sentence. Second sentence',
      };`,
      errors: [{ messageId: "missingFinalPeriod" }],
      output: `const test = {
        name: 'Username',
        value: 'username',
        description: 'First sentence. Second sentence.',
      };`,
    },
  ],
});
