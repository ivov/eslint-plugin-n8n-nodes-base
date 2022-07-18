import rule from "../lib/rules/node-param-description-missing-final-period";
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
				description: 'This a sentence. This is another.',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence. This is another</code>',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'First sentence. Second sentence.',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'Start e.g. end',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Use the multiline editor. Make sure it is in standard PEM key format:-----BEGIN PRIVATE KEY-----KEY DATA GOES HERE-----END PRIVATE KEY-----',
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
				description: 'This a sentence. This is another',
			};`,
			errors: [{ messageId: "missingFinalPeriod" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence. This is another.',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'First sentence. Second sentence',
			};`,
			errors: [{ messageId: "missingFinalPeriod" }],
			output: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'First sentence. Second sentence.',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'Person\\'s email address. Another',
			};`,
			errors: [{ messageId: "missingFinalPeriod" }],
			output: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'Person\\'s email address. Another.',
			};`,
		},
	],
});
