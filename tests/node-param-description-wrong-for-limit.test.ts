import { LIMIT_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-limit";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: '',
        description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: '',
        description: 'Wrong',
      };`,
      errors: [{ messageId: "useLimit" }],
      output: `const test = {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: '',
        description: '${LIMIT_NODE_PARAMETER.DESCRIPTION}',
      };`,
    },
  ],
});
