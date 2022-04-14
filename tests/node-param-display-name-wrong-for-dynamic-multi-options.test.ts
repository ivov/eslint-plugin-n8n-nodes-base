import rule from "../lib/rules/node-param-display-name-wrong-for-dynamic-multi-options";
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
				default: '',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Field ID',
				name: 'field',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNameOrId" }],
		},
	],
});
