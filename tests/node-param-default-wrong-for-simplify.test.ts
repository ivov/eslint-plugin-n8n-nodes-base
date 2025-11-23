import rule from "../lib/rules/node-param-default-wrong-for-simplify";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simpl',
				type: 'boolean',
				default: true,
			};`,
		},
		{
			code: outdent`
			const SIMPLIFY = true;
			const test = {
				displayName: 'Simplify',
				name: 'simpl',
				type: 'boolean',
				default: SIMPLIFY,
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: false,
			};`,
			errors: [{ messageId: "setTrueDefault" }],
			output: outdent`
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: true,
			};`,
		},
		{
			code: outdent`
			const SIMPLIFY = false;
			const test = {
				displayName: 'Simplify',
				name: 'simple',
				type: 'boolean',
				default: SIMPLIFY,
			};`,
			errors: [{ messageId: "constWrongValue" }],
		},
	],
});
