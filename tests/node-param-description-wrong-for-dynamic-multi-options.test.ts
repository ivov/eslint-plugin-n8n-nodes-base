import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-dynamic-multi-options";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: '${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'Wrong',
			};`,
			errors: [{ messageId: "useStandardDescription" }],
			output: `const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: '${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
});
