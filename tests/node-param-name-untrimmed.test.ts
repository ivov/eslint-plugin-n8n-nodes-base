import rule from "../lib/rules/node-param-name-untrimmed";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation  ',
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
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details',
						name: '   details    ',
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
