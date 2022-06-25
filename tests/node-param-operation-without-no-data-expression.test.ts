import rule from "../lib/rules/node-param-operation-without-no-data-expression";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
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
			code: outdent`
			const test = {
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
			output: outdent`
			const test = {
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
			code: outdent`
			const test = {
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
			output: outdent`
			const test = {
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
