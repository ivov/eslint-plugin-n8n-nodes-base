import rule from "../lib/rules/node-param-display-name-wrong-for-update-fields";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'person',
						],
						operation: [
							'update',
						],
					},
				},
				options: [],
			};`,
		},
		{
			code: `const test = {
				displayName: 'User ID',
				name: 'userId',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'update',
						],
					},
				},
				options: [],
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				displayName: 'Wrong',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'person',
						],
						operation: [
							'update',
						],
					},
				},
				options: [],
			};`,
			errors: [{ messageId: "useUpdateFields" }],
			output: `const test = {
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'person',
						],
						operation: [
							'update',
						],
					},
				},
				options: [],
			};`,
		},
	],
});
