import rule from "../lib/rules/node-param-hint-untrimmed";
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
				hint: 'This is a hint',
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
				hint: ' This is a hint',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				hint: 'This is a hint',
			};`,
		},
	],
});
