import rule from "../lib/rules/cred-class-field-name-uppercase-first-char";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
	invalid: [
		{
			code: `class TestApi implements ICredentialType {
				name = 'MyTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
			errors: [{ messageId: "uppercaseFirstChar" }],
			output: `class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
});
