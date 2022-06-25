import rule from "../lib/rules/node-param-display-name-untrimmed";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Operation',
				value: 'operation',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation   ',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Operation   ',
				value: 'operation',
			};`,
			errors: [{ messageId: "trimWhitespace" }],
			output: outdent`
			const test = {
				name: 'Operation',
				value: 'operation',
			};`,
		},

		{
			code: outdent`
			const test = {
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
			output: outdent`
			const test = {
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
