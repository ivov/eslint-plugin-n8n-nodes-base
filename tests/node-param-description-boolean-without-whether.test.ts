import rule from "../lib/rules/node-param-description-boolean-without-whether";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

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
