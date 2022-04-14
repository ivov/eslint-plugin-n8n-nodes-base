import { UPSERT_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-upsert";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				name: 'Upsert',
				value: 'upsert',
				description: '${UPSERT_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
	invalid: [
		{
			code: `const test = {
				name: 'Upsert',
				value: 'upsert',
				description: 'Wrong',
			};`,
			errors: [{ messageId: "useUpsertDescription" }],
			output: `const test = {
				name: 'Upsert',
				value: 'upsert',
				description: '${UPSERT_NODE_PARAMETER.DESCRIPTION}',
			};`,
		},
	],
});
