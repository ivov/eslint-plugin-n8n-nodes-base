import rule from "../lib/rules/node-param-default-wrong-for-fixed-collection";
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
				type: 'fixedCollection',
				default: {},
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = {};
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = null;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = [];
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
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
				type: 'fixedCollection',
				default: 1,
			};`,
			errors: [{ messageId: "setObjectDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: {},
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = 'string';
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
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
				type: 'fixedCollection',
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
				type: 'fixedCollection',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
	],
});
