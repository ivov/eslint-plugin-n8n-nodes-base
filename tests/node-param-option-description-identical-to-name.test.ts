import rule from "../lib/rules/node-param-option-description-identical-to-name";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Full Name',
				value: 'fullName',
				description: 'First and last name of the user',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'Full Name',
				value: 'fullName',
				description: 'The full name',
			};`,
			errors: [{ messageId: "removeDescription" }],
			output: outdent`
			const test = {
				name: 'Full Name',
				value: 'fullName',
			};`,
		},
	],
});
