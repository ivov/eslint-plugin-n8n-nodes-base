import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-dynamic-multi-options";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
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
		{
			code: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'This is a sentence. ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}.',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'This is a sentence',
			};`,
			errors: [{ messageId: "useStandardDescription" }],
			output: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'This is a sentence. ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}.',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'This is a sentence. This is another.',
			};`,
			errors: [{ messageId: "useStandardDescription" }],
			output: outdent`
			const test = {
				displayName: 'Field Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: [],
				description: 'This is a sentence. This is another. ${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}.',
			};`,
		},
	],
});
