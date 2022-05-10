import { UPSERT_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-upsert";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

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
