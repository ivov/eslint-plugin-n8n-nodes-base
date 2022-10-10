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
				displayName: 'Scope',
				name: 'scope',
				type: 'hidden',
				default: scopes,
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
		{
			code: outdent`
			const test = {
				displayName: 'Board',
				name: 'boardIdRLC',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'delete', 'update'],
						resource: ['board'],
						'@version': [2],
					},
				},
				description: 'The ID of the board',
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						hint: 'Select a board from the list',
						placeholder: 'Choose...',
						initType: 'board',
						typeOptions: {
							searchListMethod: 'searchBoards',
							searchFilterRequired: true,
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						hint: 'Enter Board Id',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-zA-Z0-9]+',
									errorMessage: 'ID value cannot be empty',
								},
							},
						],
						placeholder: 'KdEAAdde',
						url: '=https://trello.com/b/{{$value}}',
					},
					{
						displayName: 'By URL',
						name: 'url',
						type: 'string',
						hint: 'Enter board URL',
						placeholder: 'https://trello.com/b/e123456/board-name',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: 'http(s)?://trello.com/b/([a-zA-Z0-9]+)/[a-zA-Z0-9]+',
									errorMessage:
										'URL has to be in the format: http(s)://trello.com/b/<board ID>/<board name>',
								},
							},
						],
						extractValue: {
							type: 'regex',
							regex: 'https://trello.com/b/([a-zA-Z0-9]+)',
						},
					},
				],
			};`,
		}
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
