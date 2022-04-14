import rule from "../lib/rules/node-param-default-wrong-for-string";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: 1,
			};`,
			errors: [{ messageId: "setStringDefault" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
		},
	],
});
