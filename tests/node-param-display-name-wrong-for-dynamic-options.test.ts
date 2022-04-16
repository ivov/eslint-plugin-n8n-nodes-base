import rule from "../lib/rules/node-param-display-name-wrong-for-dynamic-options";
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
				displayName: 'Field ID',
				name: 'field',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getFields',
				},
				default: '',
			};`,
			errors: [{ messageId: "endWithNameOrId" }],
		},
	],
});
