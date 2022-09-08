import rule from "../lib/rules/node-param-operation-option-action-wrong-for-get-many";
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
						description: 'Retrieve all entities',
						action: 'Get many entities',
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Action',
				name: 'action',
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
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get all entities',
					},
				],
			};`,
			errors: [
				{ messageId: "changeToGetMany", data: { resourceName: "entities" } },
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
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get many entities',
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Action',
				name: 'action',
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
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get all entities',
					},
				],
			};`,
			errors: [
				{ messageId: "changeToGetMany", data: { resourceName: "entities" } },
			],
			output: outdent`
			const test = {
				displayName: 'Action',
				name: 'action',
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
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get many entities',
					},
				],
			};`,
		},
	],
});
