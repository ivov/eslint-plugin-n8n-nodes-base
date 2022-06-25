import rule from "../lib/rules/cred-class-field-placeholder-url-missing-eg";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class MyTestOAuth2Api implements ICredentialType {
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
			code: outdent`
			class MyTestOAuth2Api implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test OAuth2 API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
				placeholder = 'https://n8n.io';
			}`,
			errors: [{ messageId: "prependEg" }],
			output: outdent`
			class MyTestOAuth2Api implements ICredentialType {
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
