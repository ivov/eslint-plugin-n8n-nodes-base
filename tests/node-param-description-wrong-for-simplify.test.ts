import { SIMPLIFY_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-simplify";
import { ruleTester, getRuleName } from "../lib/ast";
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
				description: '${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}'
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
				default: true,
				description: 'Wrong'
			};`,
			errors: [{ messageId: "useSimplify" }],
			output: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: true,
				description: '${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}'
			};`,
		},
	],
});
