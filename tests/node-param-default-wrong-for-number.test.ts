import rule from "../lib/rules/node-param-default-wrong-for-number";
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
				type: 'number',
				default: 0,
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: '',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Account Contact ID',
				name: 'accountContactId',
				type: 'number',
				default: '',
				required: true,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: '0',
			};`,
			errors: [{ messageId: "setNumberDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: 0,
			};`,
		},
	],
});
