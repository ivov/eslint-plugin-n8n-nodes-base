import { UPSERT_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-upsert";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
				description: '${UPSERT_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
				description: 'Create a new contact, or update the current one if it already exists (upsert)',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
				description: 'Wrong',
			};`,
			errors: [{ messageId: "useUpsertDescription" }],
			output: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
				description: '${UPSERT_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
});
