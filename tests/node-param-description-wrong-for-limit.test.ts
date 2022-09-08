import { LIMIT_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-limit";
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
				default: '',
				description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}',
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
				default: '',
				description: 'Wrong',
			};`,
			errors: [{ messageId: "useLimit" }],
			output: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: '',
				description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
});
