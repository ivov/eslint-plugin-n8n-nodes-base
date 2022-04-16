import rule from "../lib/rules/node-param-default-wrong-for-options";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

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
				required: true,
				options: allCurrencies,
				description: "The currency of the deal in 3-character ISO format",
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
  ],
});
