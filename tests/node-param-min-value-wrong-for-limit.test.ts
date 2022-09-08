import rule from "../lib/rules/node-param-min-value-wrong-for-limit";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
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
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 0,
				},
			};`,
			errors: [{ messageId: "setPositiveMinValue" }],
			output: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
				},
			};`,
		},
	],
});
