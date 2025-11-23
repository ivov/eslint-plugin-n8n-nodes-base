import rule from "../lib/rules/node-param-default-wrong-for-multi-options";
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
				type: 'multiOptions',
				default: [],
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = [];
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = ['a', 'b'];
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: 'wrong',
			};`,
			errors: [
				{
					messageId: "setArrayDefault",
				},
			],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: [],
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = 'string';
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
		{
			code: outdent`
			const MY_DEFAULT = 123;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
		{
			code: outdent`
			const MY_DEFAULT = true;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
		{
			code: outdent`
			const MY_DEFAULT = {};
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'multiOptions',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
	],
});
