import rule from "../lib/rules/node-param-type-options-password-missing";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";
import {
	FALSE_POSITIVE_NODE_SENSITIVE_PARAM_NAMES,
	NODE_SENSITIVE_PARAM_NAMES,
} from "../lib/constants";

const TEST_NODE_SENSITIVE_STRINGS = [
	...NODE_SENSITIVE_PARAM_NAMES,
	"appPassword",
	"clientSecret",
	"accessToken",
];

const regularValidCases = TEST_NODE_SENSITIVE_STRINGS.map((name) => {
	return {
		code: outdent`
			const test = {
				displayName: 'Some Display Name',
				name: '${name}',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			}`,
	};
});

const falsePositiveValidCases = FALSE_POSITIVE_NODE_SENSITIVE_PARAM_NAMES.map(
	(name) => {
		return {
			code: outdent`
			const test = {
				displayName: 'Some Display Name',
				name: '${name}',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			}`,
		};
	}
);

const nonStringValidCases = [
	{
		code: outdent`
		const test = {
			displayName: 'Some Display Name',
			name: 'accessToken',
			type: 'hidden',
			default: '',
		}`,
	},
	{
		code: outdent`
		const test = {
			displayName: 'Is Password Protected',
			name: 'isPasswordProtected',
			type: 'boolean',
			default: '',
		}`,
	},
];

const invalidCasesAutofixable = TEST_NODE_SENSITIVE_STRINGS.map((name) => {
	return {
		code: outdent`
			const test = {
				displayName: 'Some Display Name',
				name: '${name}',
				type: 'string',
				default: '',
			}`,
		errors: [{ messageId: "addPasswordAutofixable" }],
		output: outdent`
			const test = {
				displayName: 'Some Display Name',
				name: '${name}',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			}`,
	};
});

const invalidCasesNonAutofixable = NODE_SENSITIVE_PARAM_NAMES.map((name) => {
	return {
		code: outdent`
			const test = {
				displayName: 'Some Display Name',
				name: '${name}',
				type: 'string',
				typeOptions: { someOption: true },
				default: '',
			}`,
		errors: [{ messageId: "addPasswordNonAutofixable" }],
	};
});

ruleTester().run(getRuleName(module), rule, {
	valid: [
		...regularValidCases,
		...falsePositiveValidCases,
		...nonStringValidCases,
	],
	invalid: [...invalidCasesAutofixable, ...invalidCasesNonAutofixable],
});
