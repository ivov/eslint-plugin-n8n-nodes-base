import rule from "../lib/rules/cred-class-field-display-name-missing-api";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
				name = 'testApi';
				displayName = 'Test';
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
