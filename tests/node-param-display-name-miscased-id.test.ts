import rule from "../lib/rules/node-param-display-name-miscased-id";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
			};`,
		},
		{
			code: `const test = {
				name: 'User Identifier',
				value: 'userId',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'User Id',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				displayName: 'User id',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'User id',
				value: 'userId',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
			};`,
		},
		// {
		//   code: `const test = {
		//     name: 'User Id',
		//     value: 'userId',
		//   };`,
		//   errors: [{ messageId: "uppercaseId" }],
		//   output: `const test = {
		//     name: 'User ID',
		//     value: 'userId',
		//   };`,
		// },
	],
});
