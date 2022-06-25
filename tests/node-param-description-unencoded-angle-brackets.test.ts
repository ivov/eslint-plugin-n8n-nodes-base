import rule from "../lib/rules/node-param-description-unencoded-angle-brackets";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a <b>sentence</b>',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: "Private Key",
				name: "privateKey",
				type: "string",
				typeOptions: {
					password: true,
				},
				default: "",
				required: true,
				description:
					"Use the multiline editor. Make sure it is in standard PEM key format:<br />-----BEGIN PRIVATE KEY-----<br />KEY DATA GOES HERE<br />-----END PRIVATE KEY-----",
			};`,
		},

		// option
		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <b>sentence</b>',
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
				default: '',
				description: 'This is a <value>',
			};`,
			errors: [{ messageId: "encodeAngleBrackets" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a &lt;value&gt;',
			};`,
		},

		// option
		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <value>',
			};`,
			errors: [{ messageId: "encodeAngleBrackets" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a &lt;value&gt;',
			};`,
		},
	],
});
