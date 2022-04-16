import rule from "../lib/rules/node-param-default-wrong-for-boolean";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: '',
			};`,
			errors: [{ messageId: "setBooleanDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
			};`,
		},
	],
});
