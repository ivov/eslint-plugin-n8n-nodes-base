import rule from "../lib/rules/node-param-type-options-password-missing";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";
import { SENSITIVE_INPUTS } from "../lib/constants";

const validCases = [...SENSITIVE_INPUTS].map((name) => {
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

const invalidCasesAutofixable = [...SENSITIVE_INPUTS].map((name) => {
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

const invalidCasesNonAutofixable = [...SENSITIVE_INPUTS].map((name) => {
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
	valid: validCases,
	invalid: [...invalidCasesAutofixable, ...invalidCasesNonAutofixable],
});
