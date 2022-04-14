import { RETURN_ALL_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-return-all";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				default: true,
				description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}'
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				default: true,
				description: 'Wrong'
			};`,
			errors: [{ messageId: "useReturnAll" }],
			output: `const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				default: true,
				description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}'
			};`,
		},
	],
});
