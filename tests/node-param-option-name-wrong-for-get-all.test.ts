import rule from "../lib/rules/node-param-option-name-wrong-for-get-all";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Get All',
				value: 'getAll',
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				name: 'List',
				value: 'getAll',
			};`,
			errors: [{ messageId: "useGetAll" }],
			output: outdent`
			const test = {
				name: 'Get All',
				value: 'getAll',
			};`,
		},
	],
});
