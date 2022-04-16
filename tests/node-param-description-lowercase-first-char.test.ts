import rule from "../lib/rules/node-param-description-lowercase-first-char";
import { ruleTester, getRuleName } from "../lib/utils";
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
				description: 'This is a test',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'The name of the user',
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
				description: 'this is a test',
			};`,
			errors: [{ messageId: "uppercaseFirstChar" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a test',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'the name of the user',
			};`,
			errors: [{ messageId: "uppercaseFirstChar" }],
			output: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'The name of the user',
			};`,
		},
	],
});
