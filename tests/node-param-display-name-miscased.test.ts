import rule from "../lib/rules/node-param-display-name-miscased";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test of Tests',
				name: 'testOfTests',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'Test of Tests',
				value: 'testOfTests',
			};`,
		},
		{
			code: `const test = {
				displayName: "API Domain",
				name: "apiDomain",
				type: "options",
				options: [
					{
						name: "api.jotform.com",
						value: "api.jotform.com",
					},
					{
						name: "eu-api.jotform.com",
						value: "eu-api.jotform.com",
					},
				],
				default: "api.jotform.com",
				description:
					'The API domain to use. Use "eu-api.jotform.com" if your account is in based in Europe.',
			};`,
		},
		{
			code: `const test = {
				displayName: "SASL Mechanism",
				name: "saslMechanism",
				type: "options",
				options: [
					{
						name: "Plain",
						value: "plain",
					},
					{
						name: "scram-sha-256",
						value: "scram-sha-256",
					},
					{
						name: "scram-sha-512",
						value: "scram-sha-512",
					},
				],
				default: "plain",
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Test of tests',
				name: 'testOfTests',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "useTitleCase" }],
			output: `const test = {
				displayName: 'Test of Tests',
				name: 'testOfTests',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'Using \\'Respond to Webhook\\' node',
				value: 'responseNode',
				description: 'Response defined in that node',
			};`,
			errors: [{ messageId: "useTitleCase" }],
			output: `const test = {
				name: 'Using \\'Respond to Webhook\\' Node',
				value: 'responseNode',
				description: 'Response defined in that node',
			};`,
		},
		{
			code: `const test = {
				displayName: 'Deal\\'s contact ID',
				name: 'testOfTests',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "useTitleCase" }],
			output: `const test = {
				displayName: 'Deal\\'s Contact ID',
				name: 'testOfTests',
				type: 'string',
				default: '',
			};`,
		},

		{
			code: `const test = {
				name: 'Test of tests',
				value: 'testOfTests',
			};`,
			errors: [{ messageId: "useTitleCase" }],
			output: `const test = {
				name: 'Test of Tests',
				value: 'testOfTests',
			};`,
		},

		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details test',
						name: 'detailsTest',
						values: [
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
			errors: [{ messageId: "useTitleCase" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details Test',
						name: 'detailsTest',
						values: [
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
		},
	],
});
