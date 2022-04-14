import rule from "../lib/rules/node-param-description-empty-string";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
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
				description: '',
			};`,
			errors: [{ messageId: "fillOutOrRemoveDescription" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: '',
			};`,
			errors: [{ messageId: "fillOutOrRemoveDescription" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
			};`,
		},
	],
});
