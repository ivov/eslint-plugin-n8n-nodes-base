import rule from "../lib/rules/node-param-type-options-missing-from-password";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Password',
				name: 'password',
				type: 'string',
				default: '',
			}`,
			errors: [{ messageId: "addTypeOptionsPassword" }],
			output: outdent`
			const test = {
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			}`,
		},
	],
});
