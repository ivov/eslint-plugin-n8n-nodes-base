import rule from "../lib/rules/node-param-option-description-identical-to-name";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				name: 'Full Name',
				value: 'fullName',
				description: 'First and last name of the user',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				name: 'Full Name',
				value: 'fullName',
				description: 'Full Name',
			};`,
			errors: [{ messageId: "fillOutDescription" }],
		},
	],
});
