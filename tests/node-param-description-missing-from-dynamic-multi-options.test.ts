import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-missing-from-dynamic-multi-options";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
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
				default: '',
			};`,
			errors: [{ messageId: "addStandardDescription" }],
			output: `const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
	],
});
