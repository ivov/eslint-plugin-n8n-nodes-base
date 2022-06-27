import rule from "../lib/rules/node-param-display-name-miscased-id";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User Identifier',
				value: 'userId',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'User Id',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'User Ids',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'User IDs',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'User id',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User id',
				value: 'userId',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
			};`,
		},
	],
});
