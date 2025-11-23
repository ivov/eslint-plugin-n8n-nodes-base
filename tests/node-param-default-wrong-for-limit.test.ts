import rule from "../lib/rules/node-param-default-wrong-for-limit";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
			};`,
		},
		{
			code: outdent`
			const MY_LIMIT = 50;
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: MY_LIMIT,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
			};`,
			errors: [{ messageId: "setLimitDefault" }],
			output: outdent`
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
			};`,
		},
		{
			code: outdent`
			const MY_LIMIT = 100;
			const test = {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: MY_LIMIT,
			};`,
			errors: [{ messageId: "constWrongValue" }],
		},
	],
});
