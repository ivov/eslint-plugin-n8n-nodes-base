import rule from "../lib/rules/node-param-description-excess-final-period";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'Start e.g. end',
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence.',
			};`,
      errors: [{ messageId: "excessFinalPeriod" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user.',
			};`,
      errors: [{ messageId: "excessFinalPeriod" }],
      output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Person\\'s email address.',
			};`,
      errors: [{ messageId: "excessFinalPeriod" }],
      output: outdent`
			const test = {
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Person\\'s email address',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: \`Custom Field\\'s name.\`,
			};`,
      errors: [{ messageId: "excessFinalPeriod" }],
      output: outdent`
			const test = {
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Custom Field\\'s name',
			};`,
    },
  ],
});
