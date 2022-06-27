import rule from "../lib/rules/node-param-default-wrong-for-simplify";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simpl',
				type: 'boolean',
				default: true,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: false,
			};`,
			errors: [{ messageId: "setTrueDefault" }],
			output: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: true,
			};`,
		},
	],
});
