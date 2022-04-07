import rule from "../lib/rules/node-param-display-name-wrong-for-simplify";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Simplify',
        name: 'simple',
        type: 'boolean',
        default: true,
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'SimplifyResponse',
        name: 'simple',
        type: 'boolean',
        default: true,
      };`,
      errors: [{ messageId: "useSimplify" }],
      output: `const test = {
        displayName: 'Simplify',
        name: 'simple',
        type: 'boolean',
        default: true,
      };`,
    },
  ],
});
