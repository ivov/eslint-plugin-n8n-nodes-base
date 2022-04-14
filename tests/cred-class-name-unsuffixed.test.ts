import rule from "../lib/rules/cred-class-name-unsuffixed";
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
			code: `class MyTest implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
			errors: [{ messageId: "fixSuffix" }],
			output: `class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
});
