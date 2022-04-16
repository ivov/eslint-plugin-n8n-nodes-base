import rule from "../lib/rules/node-param-option-description-identical-to-name";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

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
				description: 'Full Name',
			};`,
			errors: [{ messageId: "fillOutDescription" }],
		},
	],
});
