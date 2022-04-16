import rule from "../lib/rules/cred-class-field-documentation-url-miscased";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'MyTest';
			}`,
			errors: [{ messageId: "useCamelCase" }],
			output: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
});
