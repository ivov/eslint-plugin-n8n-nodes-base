import rule from "../lib/rules/node-param-display-name-wrong-for-simplify";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: true,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'SimplifyResponse',
				name: 'simple',
				type: 'boolean',
				default: true,
			};`,
			errors: [{ messageId: "useSimplify" }],
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
