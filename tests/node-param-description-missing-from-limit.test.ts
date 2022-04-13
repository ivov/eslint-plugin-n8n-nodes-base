import rule from "../lib/rules/node-param-description-missing-from-limit";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				type: 'number',
				description: 'Max number of results to return',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				type: 'number',
			};`,
			errors: [{ messageId: "addDescription" }],
			output: `const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				type: 'number',
				description: 'Max number of results to return',
			};`,
		},
	],
});
