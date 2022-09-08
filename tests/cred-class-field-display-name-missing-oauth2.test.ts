import rule from "../lib/rules/cred-class-field-display-name-missing-oauth2";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class MyTestOAuth2Api implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
			}`,
			errors: [{ messageId: "addOAuth2" }],
		},
	],
});
