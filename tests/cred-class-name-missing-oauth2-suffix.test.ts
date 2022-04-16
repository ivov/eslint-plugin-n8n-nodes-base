import rule from "../lib/rules/cred-class-name-missing-oauth2-suffix";
import { ruleTester, getRuleName } from "../lib/utils";
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
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class MyTestApi implements ICredentialType {
				name = 'myTestOAuth2Api';
				displayName = 'My Test OAuth2 API';
				documentationUrl = 'myTest';
				extends = [
					'oAuth2Api',
				];
			}`,
			errors: [{ messageId: "addOAuth2" }],
		},
	],
});
