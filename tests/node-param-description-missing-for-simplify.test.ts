import { SIMPLIFY_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-missing-for-simplify";
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
				description: '${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}',
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
				default: true,
			};`,
			errors: [{ messageId: "addSimplifyDescription" }],
			output: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				description: '${SIMPLIFY_NODE_PARAMETER.DESCRIPTION}',
				default: true,
			};`,
		},
	],
});
