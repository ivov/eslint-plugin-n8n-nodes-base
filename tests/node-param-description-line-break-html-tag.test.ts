import rule from "../lib/rules/node-param-description-line-break-html-tag";
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
				description: 'This is a sentence',
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
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence.<br><br> This is another.',
			};`,
		},

		// option
		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
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
				description: 'This is a <br /> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a <br > sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a <br> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a </br> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a </ br> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a sentence',
			};`,
		},

		// option

		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <br /> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
			};`,
		},

		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <br/> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
			};`,
		},

		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <br> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
			};`,
		},

		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a </br> sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
			};`,
		},

		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a </br > sentence',
			};`,
			errors: [{ messageId: "removeTag" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a sentence',
			};`,
		},
	],
});
