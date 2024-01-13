import rule from "../lib/rules/node-param-collection-type-unsorted-items";
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
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'C',
						name: 'c',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'A',
						name: 'a',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'B',
						name: 'b',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'D',
						name: 'd',
						type: 'boolean',
						default: true,
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'A',
						name: 'a',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'B',
						name: 'b',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'C',
						name: 'c',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'D',
						name: 'd',
						type: 'boolean',
						default: true,
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
						displayName: 'C',
						name: 'c',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'A',
						name: 'a',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'B',
						name: 'b',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'D',
						name: 'd',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'E',
						name: 'e',
						type: 'boolean',
						default: true,
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
						displayName: 'A',
						name: 'a',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'B',
						name: 'b',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'C',
						name: 'c',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'D',
						name: 'd',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'E',
						name: 'e',
						type: 'boolean',
						default: true,
					},
				],
			};`,
		},
	],
});
