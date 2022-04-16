import rule from "../lib/rules/node-param-default-wrong-for-limit";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
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
				default: 10,
			};`,
			errors: [{ messageId: "setLimitDefault" }],
			output: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
			};`,
		},
	],
});
