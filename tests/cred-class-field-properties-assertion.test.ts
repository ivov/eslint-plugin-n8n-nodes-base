import rule from "../lib/rules/cred-class-field-properties-assertion";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				properties: INodeProperties[] = [
					{
						displayName: 'API Root URL',
						name: 'URL',
						type: 'string',
						default: 'https://kf.kobotoolbox.org/',
					},
				];
			}`,
    },
  ],
  invalid: [
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				properties = [
					{
						displayName: 'API Root URL',
						name: 'URL',
						type: 'string' as NodePropertyTypes,
						default: 'https://kf.kobotoolbox.org/',
					},
				];
			}`,
      errors: [{ messageId: "removeAssertionAndType" }],
      output: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				properties: INodeProperties[] = [
					{
						displayName: 'API Root URL',
						name: 'URL',
						type: 'string',
						default: 'https://kf.kobotoolbox.org/',
					},
				];
			}`,
    },
    {
      code: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				properties: INodeProperties[] = [
					{
						displayName: 'API Root URL',
						name: 'URL',
						type: 'string' as NodePropertyTypes,
						default: 'https://kf.kobotoolbox.org/',
					},
				];
			}`,
      errors: [{ messageId: "removeAssertion" }],
      output: outdent`
			class TestApi implements ICredentialType {
				name = 'myTestApi';
				displayName = 'My Test API';
				documentationUrl = 'myTest';
				properties: INodeProperties[] = [
					{
						displayName: 'API Root URL',
						name: 'URL',
						type: 'string',
						default: 'https://kf.kobotoolbox.org/',
					},
				];
			}`,
    },
  ],
});
