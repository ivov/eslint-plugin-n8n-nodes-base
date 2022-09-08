import rule from "../lib/rules/node-param-placeholder-missing-email";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'hello@n8n.io',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "missingEmail" }],
			output: outdent`
			const test = {
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			};`,
		},
	],
});
