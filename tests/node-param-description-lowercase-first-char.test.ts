import rule from "../lib/rules/node-param-description-lowercase-first-char";
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
				type: 'string',
				default: '',
				description: 'This is a test',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'The name of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{
						name: 'bmp',
						value: 'bmp',
					},
					{
						name: 'gif',
						value: 'gif',
					},
					{
						name: 'jpeg',
						value: 'jpeg',
					},
					{
						name: 'png',
						value: 'png',
					},
					{
						name: 'tiff',
						value: 'tiff',
					},
				],
				default: 'jpeg',
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'this is a test',
			};`,
			errors: [{ messageId: "uppercaseFirstChar" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a test',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'the name of the user',
			};`,
			errors: [{ messageId: "uppercaseFirstChar" }],
			output: outdent`
			const test = {
				name: 'Username',
				value: 'username',
				description: 'The name of the user',
			};`,
		},
	],
});
