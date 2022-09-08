import rule from "../lib/rules/cred-class-name-unsuffixed";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

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
			class MyTest implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
			errors: [{ messageId: "fixSuffix" }],
			output: outdent`
			class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
			}`,
		},
	],
});
