import rule from "../lib/rules/node-param-description-boolean-without-whether";
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
				default: true,
				description: 'Whether to do something',
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
				default: true,
				description: 'This is wrong',
			};`,
			errors: [{ messageId: "useWhether" }],
		},
	],
});
