import rule from "../lib/rules/node-param-color-type-unused";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Foreground Colour',
				name: 'foregroundColor',
				type: 'color',
				default: '#000000',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Color',
				name: 'color',
				type: 'options',
				default: 'blue',
				options: [
					{
						name: 'Blue',
						value: 'blue',
					},
					{
						name: 'Green',
						value: 'green',
					},
				],
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Foreground Colour',
				name: 'foregroundColor',
				type: 'string',
				default: '#000000',
			};`,
			errors: [{ messageId: "useColorParam" }],
			output: outdent`
			const test = {
				displayName: 'Foreground Colour',
				name: 'foregroundColor',
				type: 'color',
				default: '#000000',
			};`,
		},
	],
});
