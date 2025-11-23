import rule from "../lib/rules/node-param-default-wrong-for-options";
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
				default: 'first',
				options: [
					{
						name: 'First',
						value: 'first',
					},
					{
						name: 'Second',
						value: 'second',
					},
				],
			};`,
		},
		{
			code: outdent`
			const allCurrencies = [];
			const test = {
				displayName: "Currency",
				name: "currency",
				type: "options",
				default: "eur",
				options: allCurrencies,
			};`,
		},
		{
			code: outdent`
			const MY_CONSTANT = { a: 1, b: 2 };
			const test = {
				displayName: "User",
				name: "currency",
				type: "options",
				default: "eur",
				options: [
					{
						name: 'a',
						value: MY_CONSTANT.a,
					},
					{
						name: 'a',
						value: MY_CONSTANT.b,
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: "Test",
				name: "test",
				type: "options",
				default: "any_value",
				typeOptions: {
					loadOptionsMethod: "getFields",
				},
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: "Model",
				name: "model",
				type: "options",
				default: "gpt-3.5-turbo-1106",
				typeOptions: {
					loadOptions: {
						routing: {
							request: {
								method: "GET",
								url: "=/v1/models",
							},
						},
					},
				},
			};`,
		},
		{
			code: outdent`
			const myVariable = "first";
			const test = {
				displayName: "Test",
				name: "test",
				type: "options",
				default: myVariable,
				options: [
					{
						name: 'First',
						value: 'first',
					},
					{
						name: 'Second',
						value: 'second',
					},
				],
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = 123;
			const test = {
				displayName: "Test",
				name: "test",
				type: "options",
				default: MY_DEFAULT,
				options: [
					{
						name: 'First',
						value: 123,
					},
					{
						name: 'Second',
						value: 456,
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: "Test",
				name: "test",
				type: "options",
				default: myObject.getValue(),
				typeOptions: {
					loadOptionsMethod: "getFields",
				},
			};`,
		},
		{
			code: outdent`
			const currencies = [{name: 'USD', value: 'USD'}, {name: 'EUR', value: 'EUR'}];
			const test = {
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				default: 'USD',
				options: currencies.sort((a, b) => a.name.localeCompare(b.name)),
			};`,
		},
		{
			code: outdent`
			const config = {
				currencyOptions: [{name: 'USD', value: 'USD'}, {name: 'EUR', value: 'EUR'}]
			};
			const test = {
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				default: 'EUR',
				options: config.currencyOptions,
			};`,
		},
		{
			code: outdent`
			const lastNodeResponseMode = {name: 'Last Node', value: 'lastNode'};
			const respondToWebhookResponseMode = {name: 'Respond to Webhook', value: 'respondToWebhook'};
			const test = {
				displayName: 'Response Mode',
				name: 'responseMode',
				type: 'options',
				options: [lastNodeResponseMode, respondToWebhookResponseMode],
				default: 'lastNode',
				description: 'When and how to respond to the webhook',
			};`,
		},
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
						name: 'Minus One',
						value: -1,
					},
					{
						name: 'Zero',
						value: 0,
					},
					{
						name: 'One',
						value: 1,
					},
				],
				default: '',
			};`,
			errors: [
				{
					messageId: "chooseOption",
					data: { eligibleOptions: "-1 or 0 or 1" },
				},
			],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				options: [
					{
						name: 'Minus One',
						value: -1,
					},
					{
						name: 'Zero',
						value: 0,
					},
					{
						name: 'One',
						value: 1,
					},
				],
				default: -1,
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: 'wrong',
				options: [
					{
						name: 'First',
						value: 'first',
					},
					{
						name: 'Second',
						value: 'second',
					},
				]
			};`,
			errors: [
				{
					messageId: "chooseOption",
					data: { eligibleOptions: "first or second" },
				},
			],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: 'first',
				options: [
					{
						name: 'First',
						value: 'first',
					},
					{
						name: 'Second',
						value: 'second',
					},
				]
			};`,
		},

		// in anticipation of typeOptions.loadOptionsMethod
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: 'wrong',
			};`,
			errors: [
				{
					messageId: "setEmptyString",
				},
			],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: '',
			};`,
		},
		{
			code: outdent`
			const MY_DEFAULT = 'wrong';
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: MY_DEFAULT,
				options: [
					{
						name: 'First',
						value: 'first',
					},
					{
						name: 'Second',
						value: 'second',
					},
				],
			};`,
			errors: [
				{
					messageId: "constWrongValue",
					data: { eligibleOptions: "first or second" },
				},
			],
		},
		{
			code: outdent`
			const MY_DEFAULT = 789;
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'options',
				default: MY_DEFAULT,
				options: [
					{
						name: 'First',
						value: 123,
					},
					{
						name: 'Second',
						value: 456,
					},
				],
			};`,
			errors: [
				{
					messageId: "constWrongValue",
					data: { eligibleOptions: "123 or 456" },
				},
			],
		},
	],
});
