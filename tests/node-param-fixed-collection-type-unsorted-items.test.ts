import rule from "../lib/rules/node-param-fixed-collection-type-unsorted-items";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
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
						name: 'details',
						values: [
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
		},
	],
	invalid: [
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
						name: 'details',
						values: [
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
								description: 'This is a <a href="https://test.com">link</a>',
							},
						],
					},
				],
			};`,
			errors: [
				{ messageId: "sortItems", data: { displayOrder: "A | B | C | D | E" } },
			],
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
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
								description: 'This is a <a href="https://test.com">link</a>',
							},
						],
					},
				],
			};`,
		},
	],
});
