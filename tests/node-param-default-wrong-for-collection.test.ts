import rule from "../lib/rules/node-param-default-wrong-for-collection";
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
				type: 'collection',
				default: {},
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = {};
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = null;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = [];
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: MY_DEFAULT,
			};`,
		},
		{
			code: outdent`
			const OPTIONS = {
				FIRST_OPTION: 'firstOption',
				SECOND_OPTION: 'secondOption',
			};
			const MY_DEFAULT = OPTIONS.FIRST_OPTION;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: MY_DEFAULT,
				options: [
					{
						name: 'First Option',
						value: OPTIONS.FIRST_OPTION,
					},
					{
						name: 'Second Option',
						value: OPTIONS.SECOND_OPTION,
					},
				],	
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: 1,
			};`,
			errors: [{ messageId: "setObjectDefault" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
				default: {},
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = 'string';
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'collection',
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
				type: 'collection',
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
				type: 'collection',
				default: MY_DEFAULT,
			};`,
			errors: [{ messageId: "constWrongType" }],
		},
	],
});
