import rule from "../lib/rules/cred-class-field-display-name-missing-api";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
			}`,
		},
	],
	invalid: [
		{
			code: `class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test';
				documentationUrl = 'test';
			}`,
			errors: [{ messageId: "fixSuffix" }],
			output: `class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
			}`,
		},
	],
});
