import rule from "../lib/rules/node-param-resource-without-no-data-expression";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
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
			code: `const test = {
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
			output: `const test = {
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
			code: `const test = {
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
			output: `const test = {
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
