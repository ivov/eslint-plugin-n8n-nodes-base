import rule from "../lib/rules/node-param-collection-type-unsorted-items";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: {},
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
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
				type: 'collection',
				default: {},
				options: [
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
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
				type: 'collection',
				default: {},
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'B',
						value: 'b',
					},
					{
						name: 'C',
						value: 'c',
					},
					{
						name: 'D',
						value: 'd',
					},
					{
						name: 'E',
						value: 'e',
					},
				],
			};`,
		},
	],
});
