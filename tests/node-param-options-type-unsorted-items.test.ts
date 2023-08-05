import rule from "../lib/rules/node-param-options-type-unsorted-items";
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
				type: 'options',
				default: 'a',
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
				type: 'options',
				default: 'a',
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
			// output: outdent`
			// const test = {
			// 	displayName: 'Test',
			// 	name: 'test',
			// 	type: 'options',
			// 	default: 'a',
			// 	options: [
			// 		{
			// 			name: 'A',
			// 			value: 'a',
			// 		},
			// 		{
			// 			name: 'B',
			// 			value: 'b',
			// 		},
			// 		{
			// 			name: 'C',
			// 			value: 'c',
			// 		},
			// 		{
			// 			name: 'D',
			// 			value: 'd',
			// 		},
			// 		{
			// 			name: 'E',
			// 			value: 'e',
			// 		},
			// 	],
			// };`,
		},
	],
});
