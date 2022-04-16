import rule from "../lib/rules/node-param-option-name-duplicate";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'B',
						value: 'b',
					},
				],
				default: 'a',
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
				options: [
					{
						name: 'A',
						value: 'a',
					},
					{
						name: 'A',
						value: 'b',
					},
				],
				default: 'a',
			};`,
			errors: [{ messageId: "removeDuplicate" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				options: [
					{
						name: 'A',
						value: 'a',
					},
				],
				default: 'a',
			};`,
		},
	],
});
