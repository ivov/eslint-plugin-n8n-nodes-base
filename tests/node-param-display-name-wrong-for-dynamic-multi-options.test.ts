import rule from "../lib/rules/node-param-display-name-wrong-for-dynamic-multi-options";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Field Names or IDs',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
		{
			// display name too long to find entity, disregard
			code: outdent`
			const test = {
				displayName: 'Properties with History',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getProperties',
				},
				default: '',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Fields',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNamesOrIds" }],
			output: outdent`
			const test = {
				displayName: 'Field Names or IDs',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Field',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNamesOrIds" }],
			output: outdent`
			const test = {
				displayName: 'Field Names or IDs',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Fields Name or ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNamesOrIds" }],
			output: outdent`
			const test = {
				displayName: 'Field Names or IDs',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Custom Schemas',
				name: 'customSchema',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getSchemas',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNamesOrIds" }],
			output: outdent`
			const test = {
				displayName: 'Custom Schema Names or IDs',
				name: 'customSchema',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getSchemas',
				},
				default: '',
			};`,
		},
	],
});
