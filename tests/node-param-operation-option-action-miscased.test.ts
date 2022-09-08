import rule from "../lib/rules/node-param-operation-option-action-miscased";
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
						action: 'Perform a PATCH request',
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
						action: 'create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete An entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
						action: 'Get an Entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get All Entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update An entity',
					},
				],
			};`,
			errors: Array.from({ length: 5 }, () => ({
				messageId: "useSentenceCase",
			})),
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
						action: 'create an entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete An entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve an entity',
						action: 'Get an Entity',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Retrieve all entities',
						action: 'Get All Entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update An entity',
					},
				],
			};`,
			errors: Array.from({ length: 5 }, () => ({
				messageId: "useSentenceCase",
			})),
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
});
