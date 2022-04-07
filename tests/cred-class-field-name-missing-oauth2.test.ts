import rule from "../lib/rules/cred-class-field-name-missing-oauth2";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `class MyTestOAuth2Api implements ICredentialType {
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
      code: `class MyTestOAuth2Api implements ICredentialType {
        name = 'myTestApi';
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
