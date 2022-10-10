import rule from "../lib/rules/node-param-default-wrong-for-string";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Tag',
				},
				default: [],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Scope',
				name: 'scope',
				type: 'hidden',
				default: scopes,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: 1,
			};`,
			errors: [{ messageId: "setStringDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
		},
	],
});
