import rule from "../lib/rules/node-param-option-name-wrong-for-upsert";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Create or Update',
				value: 'upsert',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'Insert or Create',
				value: 'upsert',
			};`,
			errors: [{ messageId: "useCreateOrUpdate" }],
			output: outdent`
			const test = {
				name: 'Create or Update',
				value: 'upsert',
			};`,
		},
	],
});
