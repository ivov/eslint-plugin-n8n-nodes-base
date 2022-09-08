import rule from "../lib/rules/cred-class-field-authenticate-type-assertion";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				authenticate: IAuthenticateGeneric = {
					type: 'generic',
					properties: {
						headers: {
							Authorization: '=Token {{$credentials.token}}',
						},
					},
				};
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				authenticate = {
					type: 'generic',
					properties: {
						headers: {
							Authorization: '=Token {{$credentials.token}}',
						},
					},
				} as IAuthenticateGeneric;
			}`,
			errors: [{ messageId: "removeAssertionAndType" }],
			output: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				authenticate: IAuthenticateGeneric = {
					type: 'generic',
					properties: {
						headers: {
							Authorization: '=Token {{$credentials.token}}',
						},
					},
				};
			}`,
		},
	],
});
