import rule from "../lib/rules/node-param-description-url-missing-protocol";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a <a href="https://github.com">link</a>',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <a href="https://github.com">link</a>',
			};`,
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
				description: 'This is a <a href="github.com">link</a>',
			};`,
			errors: [{ messageId: "addProtocol" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This is a <a href="https://github.com">link</a>',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <a href="github.com">link</a>',
			};`,
			errors: [{ messageId: "addProtocol" }],
			output: outdent`
			const test = {
				name: 'Test',
				value: 'test',
				description: 'This is a <a href="https://github.com">link</a>',
			};`,
		},
	],
});
