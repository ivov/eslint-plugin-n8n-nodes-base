import rule from "../lib/rules/node-param-resource-without-no-data-expression";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: false,
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			};`,
			errors: [{ messageId: "enableNoDataExpression" }],
			output: outdent`
			const test = {
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			};`,
			errors: [{ messageId: "addNoDataExpression" }],
			output: outdent`
			const test = {
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			};`,
		},
	],
});
