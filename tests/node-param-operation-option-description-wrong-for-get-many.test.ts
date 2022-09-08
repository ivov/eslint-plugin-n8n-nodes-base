import rule from "../lib/rules/node-param-operation-option-description-wrong-for-get-many";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'entity',
						],
					},
				},
				default: 'getAll',
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve many entities',
						action: 'Get many entities',
					},
				],
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
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'entity',
						],
					},
				},
				default: 'getAll',
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get many entities',
					},
				],
			};`,
			errors: [
				{
					messageId: "changeToGetMany",
					data: { newDescription: "Retrieve many entities" },
				},
			],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'entity',
						],
					},
				},
				default: 'getAll',
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve many entities',
						action: 'Get many entities',
					},
				],
			};`,
		},
	],
});
