import rule from "../lib/rules/node-param-default-wrong-for-boolean";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: '',
			};`,
			errors: [{ messageId: "setBooleanDefault" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
			};`,
		},
	],
});
