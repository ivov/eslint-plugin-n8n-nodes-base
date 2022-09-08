import rule from "../lib/rules/node-param-option-name-containing-star";
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
				default: 'some',
				options: [
					{
						name: '[All]',
						value: 'all',
					},
					{
						name: 'Some',
						value: 'some',
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
				default: 'some',
				options: [
					{
						name: '*',
						value: 'all',
					},
					{
						name: 'Some',
						value: 'some',
					},
				],
			};`,
			errors: [{ messageId: "replaceWithAll" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: 'some',
				options: [
					{
						name: '[All]',
						value: 'all',
					},
					{
						name: 'Some',
						value: 'some',
					},
				],
			};`,
		},
	],
});
