import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-missing-from-dynamic-options";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'options',
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
			code: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "addStandardDescription" }],
			output: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'options',
				description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
	],
});
