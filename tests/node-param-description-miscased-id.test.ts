import rule from "../lib/rules/node-param-description-miscased-id";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'Unique identifier',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The Id of the user provided',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user provided',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The Ids of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The IDs of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The ID of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The Id of the user',
			};`,
			errors: [{ messageId: "uppercaseId" }],
			output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
