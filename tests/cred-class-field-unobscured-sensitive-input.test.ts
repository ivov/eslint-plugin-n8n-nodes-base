import rule from "../lib/rules/cred-class-field-unobscured-sensitive-input";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'zammad';
				properties: INodeProperties[] = [
					{
						displayName: 'API Key',
						name: 'apiKey',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						default: '',
						required: true,
					},
				];
			}`,
			errors: [{ messageId: "addTypeOptionsPassword" }],
			output: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
		},
		{
			code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'API Key',
						name: 'apiKey',
						type: 'string',
						default: '',
						required: true,
					},
				];
			}`,
			errors: [{ messageId: "addTypeOptionsPassword" }],
			output: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'API Key',
						name: 'apiKey',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
		},
		{
			code: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Access Token',
						name: 'accessToken',
						type: 'string',
						default: '',
						required: true,
					},
				];
			}`,
			errors: [{ messageId: "addTypeOptionsPassword" }],
			output: outdent`
			export class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
				properties: INodeProperties[] = [
					{
						displayName: 'Access Token',
						name: 'accessToken',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						required: true,
					},
				];
			}`,
		},
	],
});
