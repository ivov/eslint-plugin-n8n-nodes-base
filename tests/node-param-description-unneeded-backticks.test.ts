import rule from "../lib/rules/node-param-description-unneeded-backticks";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This a sentence',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The ID of the user',
      };`,
    },
    {
      code: `const test = {
        displayName: 'Access Token',
        name: 'accessToken',
        type: 'string',
        default: '',
        description: \`The access token must have the following scopes:
        <ul>
          <li>Create/modify webhooks</li>
          <li>View webhooks</li>
          <li>View surveys</li>
          <li>View collectors</li>
          <li>View responses</li>
          <li>View response details</li>
        </ul>\`,
      }`
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: \`This a sentence\`,
      };`,
      errors: [{ messageId: "useSingleQuotes" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This a sentence',
      };`,
    },
    {
      code: `const test = {
        name: 'User ID',
        value: 'userId',
        description: \`The ID of the user\`,
      };`,
      errors: [{ messageId: "useSingleQuotes" }],
      output: `const test = {
        name: 'User ID',
        value: 'userId',
        description: 'The ID of the user',
      };`,
    },
    {
      code: `const test = {
        name: 'Timezone',
        value: 'timezone',
        description: \`Seatable server's timezone\`,
      };`,
      errors: [{ messageId: "useSingleQuotes" }],
      output: `const test = {
        name: 'Timezone',
        value: 'timezone',
        description: 'Seatable server\\'s timezone',
      };`,
    },
  ],
});
