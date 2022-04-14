import rule from "../lib/rules/node-param-operation-without-no-data-expression";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'contact',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: false,
				options: [
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'contact',
			};`,
			errors: [{ messageId: "enableNoDataExpression" }],
			output: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'contact',
			};`,
		},

		{
			code: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'contact',
			};`,
			errors: [{ messageId: "addNoDataExpression" }],
			output: `const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get',
						value: 'get',
					},
				],
				default: 'contact',
			};`,
		},
	],
});
