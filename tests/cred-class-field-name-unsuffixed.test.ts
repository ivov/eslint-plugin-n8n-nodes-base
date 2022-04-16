import rule from "../lib/rules/cred-class-field-name-unsuffixed";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestApi implements ICredentialType {
				name = 'test';
				displayName = 'Test API';
				documentationUrl = 'test';
			}`,
			errors: [{ messageId: "fixSuffix" }],
			output: outdent`
			class TestApi implements ICredentialType {
				name = 'testApi';
				displayName = 'Test API';
				documentationUrl = 'test';
			}`,
		},
	],
});
