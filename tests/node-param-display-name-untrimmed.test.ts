import rule from "../lib/rules/node-param-display-name-untrimmed";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'Operation',
				value: 'operation',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Operation   ',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: `const test = {
				name: 'Operation   ',
				value: 'operation',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: `const test = {
				name: 'Operation',
				value: 'operation',
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
						displayName: 'Details   ',
						name: 'details',
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
			errors: [{ messageId: "trimWhitespace" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details',
						name: 'details',
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
