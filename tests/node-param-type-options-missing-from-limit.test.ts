import rule from "../lib/rules/node-param-type-options-missing-from-limit";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				type: 'number',
			};`,
			errors: [{ messageId: "addTypeOptions" }],
			output: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
			};`,
		},
	],
});
