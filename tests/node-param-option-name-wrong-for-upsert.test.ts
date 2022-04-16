import rule from "../lib/rules/node-param-option-name-wrong-for-upsert";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'Insert or Create',
				value: 'upsert',
			};`,
			errors: [{ messageId: "useUpsert" }],
			output: outdent`
			const test = {
				name: 'Upsert',
				value: 'upsert',
			};`,
		},
	],
});
