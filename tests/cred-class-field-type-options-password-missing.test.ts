import rule from "../lib/rules/cred-class-field-type-options-password-missing";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";
import {
	CRED_SENSITIVE_CLASS_FIELDS,
	FALSE_POSITIVE_CRED_SENSITIVE_CLASS_FIELDS,
} from "../lib/constants";

const TEST_CRED_SENSITIVE_STRINGS = [
	...CRED_SENSITIVE_CLASS_FIELDS,
	"appPassword",
	"clientSecret",
	"accessToken",
];

const regularValidCases = TEST_CRED_SENSITIVE_STRINGS.map((name) => {
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

const falsePositiveValidCases = FALSE_POSITIVE_CRED_SENSITIVE_CLASS_FIELDS.map(
	(name) => {
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
	}
);

const nonStringValidCase = {
	code: outdent`
		export class TestApi implements ICredentialType {
			name = 'testApi';
			displayName = 'Test API';
			documentationUrl = 'zammad';
			properties: INodeProperties[] = [
				{
					displayName: 'Access Token',
					name: 'accessToken',
					type: 'hidden',
					default: '',
					required: true,
				},
			];
		}`,
};

const invalidCasesAutofixable = TEST_CRED_SENSITIVE_STRINGS.map((name) => {
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

const invalidCasesNonAutofixable = TEST_CRED_SENSITIVE_STRINGS.map((name) => {
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
	valid: [...regularValidCases, ...falsePositiveValidCases, nonStringValidCase],
	invalid: [...invalidCasesAutofixable, ...invalidCasesNonAutofixable],
});
