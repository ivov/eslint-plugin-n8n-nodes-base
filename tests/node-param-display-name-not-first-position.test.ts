import rule from "../lib/rules/node-param-display-name-not-first-position";
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
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Test of Tests',
				value: 'testOfTests',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'test',
				displayName: 'Test',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "setDisplayNameFirst" }],
		},
	],
});
