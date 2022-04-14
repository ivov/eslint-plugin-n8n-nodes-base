import rule from "../lib/rules/node-param-description-miscased-id";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'Unique identifier',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The Id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The Id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
