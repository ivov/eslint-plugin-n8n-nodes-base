import rule from "../lib/rules/node-param-option-name-wrong-for-get-many";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				name: 'Get Many',
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
			errors: [{ messageId: "useGetMany" }],
			output: outdent`
			const test = {
				name: 'Get Many',
				value: 'getAll',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'Get All',
				value: 'getAll',
			};`,
			errors: [{ messageId: "useGetMany" }],
			output: outdent`
			const test = {
				name: 'Get Many',
				value: 'getAll',
			};`,
		},
	],
});
