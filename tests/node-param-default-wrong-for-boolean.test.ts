import rule from "../lib/rules/node-param-default-wrong-for-boolean";
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
				type: 'boolean',
				default: false,
			};`,
		},
		{
			code: outdent`
			const IS_ENABLED = true;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: IS_ENABLED,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: '',
			};`,
			errors: [{ messageId: "setBooleanDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: false,
			};`,
		},
		{
			code: outdent`
			const IS_ENABLED = 'true';
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: IS_ENABLED,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
		{
			code: outdent`
			const IS_ENABLED = 1;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'boolean',
				default: IS_ENABLED,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
	],
});
