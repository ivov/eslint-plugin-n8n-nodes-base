import rule from "../lib/rules/node-param-description-identical-to-display-name";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a test',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Test',
			};`,
			errors: [{ messageId: "fillOutDescription" }],
		},
	],
});
