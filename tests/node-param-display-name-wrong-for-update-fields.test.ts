import rule from "../lib/rules/node-param-display-name-wrong-for-update-fields";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
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
			code: outdent`
			const test = {
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
			code: outdent`
			const test = {
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
			output: outdent`
			const test = {
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
