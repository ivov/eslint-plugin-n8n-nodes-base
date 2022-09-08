import rule from "../lib/rules/node-param-fixed-collection-type-unsorted-items";
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
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details',
						name: 'details',
						values: [
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Address',
				name: 'address',
				placeholder: 'Add Address Fields',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address Details',
						name: 'addressFields',
						values: [
							{
								displayName: 'Line 1',
								name: 'line1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Line 2',
								name: 'line2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Zip Code',
								name: 'zipcode',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Address',
				name: 'address',
				placeholder: 'Add Address Fields',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Details',
						name: 'addressFields',
						values: [
							{
								displayName: 'Line 1',
								name: 'line1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Line 2',
								name: 'line2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Zip Code',
								name: 'zipcode',
								type: 'string',
								default: '',
							},
						],
					},
				],
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details',
						name: 'details',
						values: [
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
								description: 'This is a <a href="https://test.com">link</a>',
							},
						],
					},
				],
			};`,
			errors: [
				{ messageId: "sortItems", data: { displayOrder: "A | B | C | D | E" } },
			],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'fixedCollection',
				default: 'a',
				options: [
					{
						displayName: 'Details',
						name: 'details',
						values: [
							{
								displayName: 'A',
								name: 'a',
								type: 'string',
								default: '',
							},
							{
								displayName: 'B',
								name: 'b',
								type: 'string',
								default: '',
							},
							{
								displayName: 'C',
								name: 'c',
								type: 'string',
								default: '',
							},
							{
								displayName: 'D',
								name: 'd',
								type: 'string',
								default: '',
							},
							{
								displayName: 'E',
								name: 'e',
								type: 'string',
								default: '',
								description: 'This is a <a href="https://test.com">link</a>',
							},
						],
					},
				],
			};`,
		},

		{
			code: outdent`
			const test = {
				displayName: 'Extraction Values',
				name: 'extractionValues',
				placeholder: 'Add Value',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'values',
						displayName: 'Values',
						values: [
							{
								displayName: 'Return Value',
								name: 'returnValue',
								type: 'options',
								options: [
									{
										name: 'Attribute',
										value: 'attribute',
										description: 'Get an attribute value like "class" from an element',
									},
									{
										name: 'HTML',
										value: 'html',
										description: 'Get the HTML the element contains',
									},
									{
										name: 'Text',
										value: 'text',
										description: 'Get only the text content of the element',
									},
									{
										name: 'Value',
										value: 'value',
										description: 'Get value of an input, select or textarea',
									},
								],
								default: 'text',
								description: 'What kind of data should be returned',
							},
							{
								displayName: 'Hello',
								name: 'hello',
								type: 'string',
								default: '',
								placeholder: 'class',
								description: 'The name of the attribute to return the value off',
							},
							{
								displayName: 'Zoo',
								name: 'zoo',
								type: 'boolean',
								default: false,
							},
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The key under which the extracted value should be saved',
							},
							{
								displayName: 'CSS Selector',
								name: 'cssSelector',
								type: 'string',
								default: '',
								placeholder: '.price',
								description: 'The CSS selector to use',
							},
						],
					},
				],
			};`,
			errors: [
				{
					messageId: "sortItems",
					data: {
						displayOrder: "CSS Selector | Hello | Key | Return Value | Zoo",
					},
				},
			],
			output: outdent`
			const test = {
				displayName: 'Extraction Values',
				name: 'extractionValues',
				placeholder: 'Add Value',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'values',
						displayName: 'Values',
						values: [
							{
								displayName: 'CSS Selector',
								name: 'cssSelector',
								type: 'string',
								default: '',
								placeholder: '.price',
								description: 'The CSS selector to use',
							},
							{
								displayName: 'Hello',
								name: 'hello',
								type: 'string',
								default: '',
								placeholder: 'class',
								description: 'The name of the attribute to return the value off',
							},
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'The key under which the extracted value should be saved',
							},
							{
								displayName: 'Return Value',
								name: 'returnValue',
								type: 'options',
								options: [
									{
										name: 'Attribute',
										value: 'attribute',
										description: 'Get an attribute value like \\'class\\' from an element',
									},
									{
										name: 'HTML',
										value: 'html',
										description: 'Get the HTML the element contains',
									},
									{
										name: 'Text',
										value: 'text',
										description: 'Get only the text content of the element',
									},
									{
										name: 'Value',
										value: 'value',
										description: 'Get value of an input, select or textarea',
									},
								],
								default: 'text',
								description: 'What kind of data should be returned',
							},
							{
								displayName: 'Zoo',
								name: 'zoo',
								type: 'boolean',
								default: false,
							},
						],
					},
				],
			};`,
		},
	],
});
