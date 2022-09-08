import { RETURN_ALL_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-missing-for-return-all";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}',
				default: true,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				default: true,
			};`,
			errors: [{ messageId: "addReturnAllDescription" }],
			output: outdent`
			const test = {
				displayName: '${RETURN_ALL_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'returnAll',
				type: 'boolean',
				description: '${RETURN_ALL_NODE_PARAMETER.DESCRIPTION}',
				default: true,
			};`,
		},
	],
});
