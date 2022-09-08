import rule from "../lib/rules/node-param-operation-option-without-action";
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
						name: 'Create',
						value: 'create',
						description: 'Create an entity',
						action: 'Create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete an entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
						action: 'Get an entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get all entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update an entity',
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
						name: 'Create',
						value: 'create',
						description: 'Create an entity',
						action: 'Create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete an entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
						action: 'Get an entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get all entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update an entity',
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
						name: 'Create',
						value: 'create',
						description: 'Create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
					},
				],
			};`,
			errors: Array.from({ length: 5 }, () => ({ messageId: "addAction" })),
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
						name: 'Create',
						value: 'create',
						description: 'Create an entity',
						action: 'Create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete an entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
						action: 'Get an entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get all entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update an entity',
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
							'accountContact',
						],
					},
				},
				default: 'getAll',
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an account contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an account contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an account contact',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all account contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an account contact',
					},
				],
			};`,
			errors: Array.from({ length: 5 }, () => ({ messageId: "addAction" })),
			output: outdent`
			const test = {
				displayName: 'Action',
				name: 'action',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'accountContact',
						],
					},
				},
				default: 'getAll',
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an account contact',
						action: 'Create an account contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an account contact',
						action: 'Delete an account contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an account contact',
						action: 'Get an account contact',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all account contacts',
						action: 'Get all account contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an account contact',
						action: 'Update an account contact',
					},
				],
			};`,
		},
	],
});
