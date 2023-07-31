import rule from "../lib/rules/cred-class-field-type-options-password-missing";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";
import { SENSITIVE_INPUTS } from "../lib/constants";

const validCases = [...SENSITIVE_INPUTS].map((name) => {
	return {
		code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'zammad';
				properties: INodeProperties[] = [
					{
						displayName: 'Some Display Name',
						name: '${name}',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
	};
});

const invalidCasesAutofixable = [...SENSITIVE_INPUTS].map((name) => {
	return {
		code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Some Display Name',
						name: '${name}',
						type: 'string',
						default: '',
						required: true,
					},
				];
			}`,
		errors: [{ messageId: "addPasswordAutofixable" }],
		output: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Some Display Name',
						name: '${name}',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
	};
});

const invalidCasesNonAutofixable = [...SENSITIVE_INPUTS].map((name) => {
	return {
		code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Some Display Name',
						name: '${name}',
						type: 'string',
						typeOptions: { someOption: true },
						default: '',
						required: true,
					},
				];
			}`,
		errors: [{ messageId: "addPasswordNonAutofixable" }],
	};
});

ruleTester().run(getRuleName(module), rule, {
	valid: validCases,
	invalid: [...invalidCasesAutofixable, ...invalidCasesNonAutofixable],
});
