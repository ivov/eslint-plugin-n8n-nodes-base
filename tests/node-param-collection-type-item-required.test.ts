import rule from "../lib/rules/node-param-collection-type-item-required";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: "Options",
				name: "options",
				type: "collection",
				placeholder: "Add Option",
				default: {},
				displayOptions: {
					show: {
						resource: ["collection"],
						operation: ["getAll"],
					},
				},
				options: [
					{
						displayName: "First",
						name: "first",
						type: "boolean",
						default: true,
					},
					{
						displayName: "Second",
						name: "second",
						type: "string",
						default: '',
					},
				],
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: "Options",
				name: "options",
				type: "collection",
				placeholder: "Add Option",
				default: {},
				displayOptions: {
					show: {
						resource: ["collection"],
						operation: ["getAll"],
					},
				},
				options: [
					{
						displayName: "First",
						name: "first",
						type: "boolean",
						required: true,
						default: true,
					},
					{
						displayName: "Second",
						name: "second",
						type: "string",
						default: '',
					},
				],
			};`,
			errors: [{ messageId: "removeRequired" }],
			output: outdent`
			const test = {
				displayName: "Options",
				name: "options",
				type: "collection",
				placeholder: "Add Option",
				default: {},
				displayOptions: {
					show: {
						resource: ["collection"],
						operation: ["getAll"],
					},
				},
				options: [
					{
						displayName: "First",
						name: "first",
						type: "boolean",
						default: true,
					},
					{
						displayName: "Second",
						name: "second",
						type: "string",
						default: '',
					},
				],
			};`,
		},
	],
});
