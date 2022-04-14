import rule from "../lib/rules/cred-class-field-placeholder-url-missing-eg";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `class MyTestOAuth2Api implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test OAuth2 API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
				placeholder = 'e.g. https://n8n.io';
			}`,
		},
	],
	invalid: [
		{
			code: `class MyTestOAuth2Api implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test OAuth2 API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
				placeholder = 'https://n8n.io';
			}`,
			errors: [{ messageId: "prependEg" }],
			output: `class MyTestOAuth2Api implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test OAuth2 API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
				placeholder = 'e.g. https://n8n.io';
			}`,
		},
	],
});
