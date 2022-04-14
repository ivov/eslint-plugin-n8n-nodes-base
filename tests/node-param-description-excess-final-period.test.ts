import rule from "../lib/rules/node-param-description-excess-final-period";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
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
				description: 'This a sentence.',
			};`,
			errors: [{ messageId: "excessFinalPeriod" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user.',
			};`,
			errors: [{ messageId: "excessFinalPeriod" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
