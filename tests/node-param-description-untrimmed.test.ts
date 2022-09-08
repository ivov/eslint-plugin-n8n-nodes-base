import rule from "../lib/rules/node-param-description-untrimmed";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
