import rule from "../lib/rules/node-param-description-untrimmed";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'This is a description',
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
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'This is a description   ',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'This is a description',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user   ',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
