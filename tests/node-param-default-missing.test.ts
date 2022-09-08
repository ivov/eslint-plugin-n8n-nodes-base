import rule from "../lib/rules/node-param-default-missing";
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
				type: 'options',
				default: 'firstOption',
				options: [
					{
						name: 'First Option',
						value: 'firstOption',
					},
					{
						name: 'Second Option',
						value: 'secondOption',
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Scope',
				name: 'scope',
				type: 'hidden',
				default: scopes.join(','),
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Auth URI Query Parameters',
				name: 'authQueryParameters',
				type: 'hidden',
				default: \`user_scope=\${userScopes.join(' ')}\`,
			}`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: -1,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				options: [
					{
						name: 'First Option',
						value: 'firstOption',
					},
					{
						name: 'Second Option',
						value: 'secondOption',
					},
				],
			};`,
			errors: [{ messageId: "addDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: 'firstOption',
				options: [
					{
						name: 'First Option',
						value: 'firstOption',
					},
					{
						name: 'Second Option',
						value: 'secondOption',
					},
				],
			};`,
		},

		// no default when no options should add empty string as temp default
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
			};`,
			errors: [{ messageId: "addDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: '',
			};`,
		},
	],
});
