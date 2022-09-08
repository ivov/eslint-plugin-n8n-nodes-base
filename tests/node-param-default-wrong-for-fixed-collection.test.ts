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
	],
});
