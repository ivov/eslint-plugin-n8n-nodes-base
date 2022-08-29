import rule from "../lib/rules/node-param-type-options-max-value-present";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
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
			code: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				default: 50,
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1,
				},
			};`,
			errors: [{ messageId: "removeMaxValue" }],
			output: outdent`
			const test = {
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
