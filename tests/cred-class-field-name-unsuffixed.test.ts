import rule from "../lib/rules/cred-class-field-name-unsuffixed";
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
				name = 'test';
				displayName = 'Test API';
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
