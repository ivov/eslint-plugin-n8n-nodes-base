import rule from "../lib/rules/cred-class-field-documentation-url-not-http-url";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'http://example.com/docs/auth';
			}`,
    },
    {
      code: outdent`
			class MyTestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'https://example.com/docs/auth';
			}`,
    },
  ],
  invalid: [
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'lowercase';
			}`,
      errors: [{ messageId: "useHttpUrl" }],
    },
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'camelCase';
			}`,
      errors: [{ messageId: "useHttpUrl" }],
    },
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'PascalCase';
			}`,
      errors: [{ messageId: "useHttpUrl" }],
    },
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'Sentence case';
			}`,
      errors: [{ messageId: "useHttpUrl" }],
    },
  ],
});
