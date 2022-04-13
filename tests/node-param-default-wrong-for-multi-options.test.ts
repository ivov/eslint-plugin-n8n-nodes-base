import rule from "../lib/rules/node-param-default-wrong-for-multi-options";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: [],
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: 'wrong',
			};`,
			errors: [
				{
					messageId: "setArrayDefault",
				},
			],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: [],
			};`,
		},
	],
});
