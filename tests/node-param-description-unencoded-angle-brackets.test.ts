import rule from "../lib/rules/node-param-description-unencoded-angle-brackets";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <b>sentence</b>',
      };`,
    },
    {
      code: `const test = {
        displayName: "Private Key",
        name: "privateKey",
        type: "string",
        typeOptions: {
          password: true,
        },
        default: "",
        required: true,
        description:
          "Use the multiline editor. Make sure it is in standard PEM key format:<br />-----BEGIN PRIVATE KEY-----<br />KEY DATA GOES HERE<br />-----END PRIVATE KEY-----",
      };`,
    },

    // option
    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <b>sentence</b>',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a <value>',
      };`,
      errors: [{ messageId: "encodeAngleBrackets" }],
      output: `const test = {
        displayName: 'Test',
        name: 'test',
        type: 'string',
        default: '',
        description: 'This is a &lt;value&gt;',
      };`,
    },

    // option
    {
      code: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a <value>',
      };`,
      errors: [{ messageId: "encodeAngleBrackets" }],
      output: `const test = {
        name: 'Test',
        value: 'test',
        description: 'This is a &lt;value&gt;',
      };`,
    },
  ],
});
