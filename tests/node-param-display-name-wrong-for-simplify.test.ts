import rule from "../lib/rules/node-param-display-name-wrong-for-simplify";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
